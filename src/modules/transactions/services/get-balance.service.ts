import { Injectable } from '@nestjs/common';
import { ILogger } from '@/@shared/classes/custom-logger';
import { Result } from '@/@shared/classes/result';
import { AbstractService } from '@/@shared/classes/service';
import {
  ITIAProviderAccountBalanceResponse,
  TTIAProvider,
} from '@/@shared/providers/tia-provider/models/tia-provider.struct';

import { IRequestContext } from '@/@shared/protocols/request-context.struct';

export abstract class TGetBalanceService extends AbstractService<
  void,
  ITIAProviderAccountBalanceResponse
> {}

@Injectable()
export class GetBalanceService implements TGetBalanceService {
  constructor(
    /// //////////////////////////
    //  Providers
    /// //////////////////////////
    private tiaProvider: TTIAProvider,
    public logger: ILogger,
  ) {
    this.logger.setContextName(GetBalanceService.name);
  }

  async execute(
    _,
    context?: IRequestContext,
  ): Promise<Result<ITIAProviderAccountBalanceResponse>> {
    this.logger.log('Getting account balance');

    const accountBalanceResult = await this.tiaProvider.accountBalance();

    if (accountBalanceResult.error) {
      const throwError = accountBalanceResult.error;

      this.logger.warn(throwError.message, context);

      return Result.fail(throwError);
    }

    return Result.success(accountBalanceResult.getValue()!);
  }
}
