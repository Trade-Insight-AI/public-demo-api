import { Injectable } from '@nestjs/common';
import { AccountEntity } from '../entities/account.entity';
import { AbstractRepository } from '@/@shared/classes/repository';
import { IAccountModel } from '../models/account.struct';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CustomLogger } from '@/@shared/classes/custom-logger';
import { TEnvService } from '@/modules/env/services/env.service';

export class IAccountsRepository extends AbstractRepository<
  AccountEntity,
  IAccountModel
> {}

@Injectable()
export class AccountsRepository extends IAccountsRepository {
  constructor(
    @InjectRepository(AccountEntity)
    readonly accountRepository: Repository<AccountEntity>,
    readonly envService: TEnvService,
  ) {
    super(
      accountRepository,
      envService,
      new CustomLogger(envService, AccountsRepository.name),
    );
  }
}
