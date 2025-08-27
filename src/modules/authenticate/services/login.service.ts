import { Injectable } from '@nestjs/common';

import { Result } from '@/@shared/classes/result';
import { AbstractService } from '@/@shared/classes/service';
import { ILogger } from '@/@shared/classes/custom-logger';

import { IAccountsRepository } from '@/modules/accounts/repositories/accounts.repository';
import {
  loginDtoServiceSchema,
  TLoginDtoBodySchema,
  TLoginDtoServiceSchema,
} from '../dto/login.dto';
import { TGenerateTokensService } from './generate-tokens.service';
import { AccountNotFoundException } from '@/modules/accounts/errors/account-not-found.exception';
import { THasher } from '@/@shared/cryptography/services/bcrypt-hasher.service';
import { IRequestContext } from '@/@shared/protocols/request-context.struct';
import { IAccountModel } from '@/modules/accounts/models/account.struct';
import { Normalize } from '@/@shared/utils/normalize';

export interface ILoginServiceResponse {
  accessToken: string;
  refreshToken: string;
  account: IAccountModel;
}

export abstract class TLoginService extends AbstractService<
  TLoginDtoBodySchema,
  ILoginServiceResponse
> {}

@Injectable()
export class LoginService implements TLoginService {
  constructor(
    /// //////////////////////////
    //  Services
    /// //////////////////////////
    private generateTokensService: TGenerateTokensService,

    /// //////////////////////////
    //  Repositories
    /// //////////////////////////
    private accountsRepository: IAccountsRepository,

    /// //////////////////////////
    //  Providers
    /// //////////////////////////
    private hasherProvider: THasher,
    public logger: ILogger,
  ) {
    this.logger.setContextName(LoginService.name);
  }

  async execute(
    serviceDto: TLoginDtoServiceSchema,
    context?: IRequestContext,
  ): Promise<Result<ILoginServiceResponse>> {
    const validateDtoResult = await this.validateDto(serviceDto);

    if (validateDtoResult.error) {
      return Result.fail(validateDtoResult.error);
    }

    const { password, account } = validateDtoResult.getValue()!;

    const matchPassword = await this.hasherProvider.compare(
      password,
      account.password,
    );

    if (!matchPassword) {
      this.logger.log(
        `Invalid password for account with email: ${account.email}`,
        context,
      );

      return Result.fail(
        new AccountNotFoundException(undefined, account.email),
      );
    }

    // Generate tokens for the authenticated account
    const generateTokensResult = await this.generateTokensService.execute({
      accountId: account.id,
    });

    if (generateTokensResult.error) {
      return Result.fail(generateTokensResult.error);
    }

    const { accessToken, refreshToken } = generateTokensResult.getValue()!;

    return Result.success({
      accessToken,
      refreshToken,
      account,
    });
  }

  async validateDto(
    serviceDto: TLoginDtoBodySchema,
  ): Promise<Result<TLoginDtoBodySchema & { account: IAccountModel }>> {
    try {
      const validatedDto = loginDtoServiceSchema.parse(serviceDto);
      const normalizedEmail = Normalize.email(validatedDto.email);

      const account = await this.accountsRepository.findOne({
        where: {
          email: normalizedEmail,
        },
      });

      if (!account) {
        return Result.fail(
          new AccountNotFoundException(undefined, validatedDto.email),
        );
      }

      return Result.success({
        account,
        ...validatedDto,
      });
    } catch (error) {
      return Result.fail(error as Error);
    }
  }
}
