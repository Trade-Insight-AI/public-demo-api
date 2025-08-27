import { Injectable } from '@nestjs/common';

import { Result } from '@/@shared/classes/result';
import { AbstractService } from '@/@shared/classes/service';
import { ILogger } from '@/@shared/classes/custom-logger';
import { IAccountsRepository } from '@/modules/accounts/repositories/accounts.repository';
import { AccountNotFoundException } from '@/modules/accounts/errors/account-not-found.exception';
import { IAccountModel } from '@/modules/accounts/models/account.struct';

export interface IGetCurrentUserServiceDTO {
  sub: string;
}

export abstract class TGetCurrentUserService extends AbstractService<
  IGetCurrentUserServiceDTO,
  IAccountModel
> {}

@Injectable()
export class GetCurrentUserService implements TGetCurrentUserService {
  constructor(
    private accountsRepository: IAccountsRepository,
    public logger: ILogger,
  ) {
    this.logger.setContextName(GetCurrentUserService.name);
  }

  async execute({
    sub,
  }: IGetCurrentUserServiceDTO): Promise<Result<IAccountModel>> {
    const account = await this.accountsRepository.findById(sub);

    if (!account) {
      return Result.fail(new AccountNotFoundException(sub));
    }

    return Result.success(account);
  }
}
