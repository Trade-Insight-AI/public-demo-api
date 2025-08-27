import { Injectable } from '@nestjs/common';

import { Result } from '@/@shared/classes/result';
import { AbstractService } from '@/@shared/classes/service';
import { ILogger } from '@/@shared/classes/custom-logger';

import { IAccountsRepository } from '@/modules/accounts/repositories/accounts.repository';
import { TJWTEncrypter } from '@/@shared/cryptography/services/jwt-encrypter.service';
import { AccountNotFoundException } from '@/modules/accounts/errors/account-not-found.exception';
import { TGenerateTokensDtoServiceSchema } from '../dto/generate-tokens.dto';

export interface IGenerateTokensServiceResponse {
  accessToken: string;
  refreshToken: string;
}

export abstract class TGenerateTokensService extends AbstractService<
  TGenerateTokensDtoServiceSchema,
  IGenerateTokensServiceResponse
> {}

@Injectable()
export class GenerateTokensService implements TGenerateTokensService {
  constructor(
    /// //////////////////////////
    //  Repositories
    /// //////////////////////////
    private accountsRepository: IAccountsRepository,

    /// //////////////////////////
    //  Providers
    /// //////////////////////////
    private encrypter: TJWTEncrypter,
    public logger: ILogger,
  ) {
    this.logger.setContextName(GenerateTokensService.name);
  }

  async execute({
    accountId,
  }: TGenerateTokensDtoServiceSchema): Promise<
    Result<IGenerateTokensServiceResponse>
  > {
    // Check if account exists
    const account = await this.accountsRepository.findById(accountId);

    if (!account) {
      return Result.fail(new AccountNotFoundException(accountId));
    }

    // Generate tokens with accountId as subject
    const accessToken = await this.encrypter.accessToken({ sub: accountId });
    const refreshToken = await this.encrypter.refreshToken({ sub: accountId });

    // Update account with generated tokens
    await this.accountsRepository.update(accountId, {
      accessToken,
      refreshToken,
    });

    return Result.success({
      accessToken,
      refreshToken,
    });
  }
}
