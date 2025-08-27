import { Inject, Injectable } from '@nestjs/common';
import { AxiosError, AxiosInstance } from 'axios';

import { ILogger } from '@/@shared/classes/custom-logger';
import { Result } from '@/@shared/classes/result';
import {
  ITIAProviderEnvironment,
  TTIAProvider,
  ITIAProviderListEnginesResponse,
  ITIAProviderClassifyProductDTO,
  ITIAProviderAccountBalanceResponse,
  ITIAProviderBulkClassifyDTO,
  ITIAProviderBulkClassifyResponse,
} from '../models/tia-provider.struct';
import {
  TIA_PROVIDER_ENVIRONMENT,
  TIA_PROVIDER_HTTP_CLIENT,
} from '../models/tia-provider-metadata.struct';
import { DefaultException } from '@/@shared/errors/abstract-application-exception';
import { ITIAProviderClassifyProductDetails } from '../models/tia-provider-classify-product.struct';

@Injectable()
export class TIAProvider implements TTIAProvider {
  private paths = {
    auth: {
      login: 'auth/m2m-token',
    },
    engines: {
      listEngines: 'engines',
    },
    transactions: {
      balance: 'transaction/balance',
    },
    classifications: {
      classifyProduct: 'classify/v1',

      bulkClassify: 'bulk-classifications/v1',
    },
  };

  private tiaAccessToken: string | undefined = undefined;
  private tiaAccessTokenExpiresAt: Date | undefined = undefined;

  constructor(
    @Inject(TIA_PROVIDER_HTTP_CLIENT)
    private httpClient: AxiosInstance,

    @Inject(TIA_PROVIDER_ENVIRONMENT)
    private env: ITIAProviderEnvironment,

    private logger: ILogger,
  ) {
    this.logger.setContextName(TIAProvider.name);
  }

  async login(): Promise<Result<void>> {
    try {
      this.logger.log(`[TIAProvider login]`);

      const { data } = await this.httpClient.post(this.paths.auth.login, {
        clientId: this.env.clientId,
        clientSecret: this.env.clientSecret,
      });

      this.logger.log(`[TIAProvider login] response: ${JSON.stringify(data)}`);

      this.tiaAccessToken = data.token.access_token;
      this.tiaAccessTokenExpiresAt = new Date(
        Date.now() + data.token.expires_in * 1000,
      );

      return Result.success();
    } catch (error) {
      return Result.fail(this.errorHandler(error));
    }
  }

  async listEngines(): Promise<Result<ITIAProviderListEnginesResponse>> {
    try {
      this.logger.log(`[TIAProvider listEngines]`);

      await this.validateAndAutoRefreshTokenIfNeeded();

      const { data } = await this.httpClient.get(
        this.paths.engines.listEngines,
        {
          headers: {
            Authorization: `Bearer ${this.tiaAccessToken}`,
          },
        },
      );

      this.logger.log(
        `[TIAProvider listEngines] response: ${JSON.stringify(data)}`,
      );

      return Result.success({
        engines: data,
      });
    } catch (error) {
      return Result.fail(this.errorHandler(error));
    }
  }

  async accountBalance(): Promise<Result<ITIAProviderAccountBalanceResponse>> {
    try {
      this.logger.log(`[TIAProvider accountBalance]`);

      await this.validateAndAutoRefreshTokenIfNeeded();

      const { data } = await this.httpClient.get(
        this.paths.transactions.balance,
        {
          headers: {
            Authorization: `Bearer ${this.tiaAccessToken}`,
          },
        },
      );

      this.logger.log(
        `[TIAProvider accountBalance] response: ${JSON.stringify(data)}`,
      );

      return Result.success(data);
    } catch (error) {
      return Result.fail(this.errorHandler(error));
    }
  }

  async classifyProduct(
    payload: ITIAProviderClassifyProductDTO,
  ): Promise<Result<ITIAProviderClassifyProductDetails>> {
    try {
      this.logger.log(
        `[TIAProvider classifyProduct] payload: ${JSON.stringify(payload)}`,
      );

      await this.validateAndAutoRefreshTokenIfNeeded();

      const { data } = await this.httpClient.post(
        this.paths.classifications.classifyProduct,
        payload,
        {
          headers: {
            Authorization: `Bearer ${this.tiaAccessToken}`,
          },
        },
      );

      this.logger.log(
        `[TIAProvider classifyProduct] response: ${JSON.stringify(data)}`,
      );

      return Result.success(data);
    } catch (error) {
      return Result.fail(this.errorHandler(error));
    }
  }

  async bulkClassify(
    payload: ITIAProviderBulkClassifyDTO,
  ): Promise<Result<ITIAProviderBulkClassifyResponse>> {
    try {
      this.logger.log(
        `[TIAProvider bulkClassify] payload: ${JSON.stringify(payload)}`,
      );

      await this.validateAndAutoRefreshTokenIfNeeded();

      const { data } = await this.httpClient.post(
        this.paths.classifications.bulkClassify,
        {
          engine: payload.engine,
          priority: payload.priority,
          forceReprocess: payload.forceReprocess,
          file: payload.file.buffer,

          requestId: payload.requestId,
          description: payload.description,
          testMode: payload.testMode,
          mockDelay: payload.mockDelay,
        },
        {
          headers: {
            Authorization: `Bearer ${this.tiaAccessToken}`,
            'Content-Type': 'multipart/form-data',
          },
        },
      );

      this.logger.log(
        `[TIAProvider bulkClassify] response: ${JSON.stringify(data)}`,
      );

      return Result.success(data);
    } catch (error) {
      return Result.fail(this.errorHandler(error));
    }
  }

  /// //////////////////////////
  //  Utils
  /// //////////////////////////
  async validateAndAutoRefreshTokenIfNeeded(): Promise<void> {
    if (this.isAccessTokenExpired()) {
      this.logger.log(
        `[TIAProvider validateAndAutoRefreshTokenIfNeeded] Access token expired or doesn't exists yet, refreshing...`,
      );

      const result = await this.login();

      if (result.error) {
        this.logger.error(
          `[TIAProvider validateAndAutoRefreshTokenIfNeeded] Failed to refresh access token. ${result.error.message}`,
        );

        throw result.error;
      }
    }
  }

  isAccessTokenExpired(): boolean {
    if (!this.tiaAccessTokenExpiresAt) {
      return true;
    }

    return Date.now() > this.tiaAccessTokenExpiresAt.getTime();
  }

  private errorHandler(error: AxiosError | Error): Error {
    let message = String(error);
    const metadata: any = {};

    if (error instanceof AxiosError) {
      const url = error.config?.url;
      const method = error.config?.method?.toUpperCase();
      const status = error.response?.status;
      const payloadSent = error.config?.data;
      const data = error.response?.data;

      if (url) metadata.url = url;
      if (method) metadata.method = method;
      if (status) metadata.status = status;
      if (payloadSent) metadata.payloadSent = payloadSent;
      if (data) metadata.data = data;

      message =
        error.response?.data?.message ||
        error.response?.data?.description ||
        'Unknown error';
    }

    this.logger.debug(
      `[TIAProvider errorHandler] ${message} ${JSON.stringify(metadata)}`,
    );

    return new DefaultException(message);
  }
}
