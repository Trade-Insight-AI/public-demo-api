import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AccountEntity } from './entities/account.entity';
import {
  IAccountsRepository,
  AccountsRepository,
} from './repositories/accounts.repository';
import {
  IAccountPresenter,
  AccountPresenter,
} from './presenters/account.presenter';

// Services
import {
  TCreateAccountService,
  CreateAccountService,
} from './services/create-account.service';

// Modules
import { EnvModule } from '@/modules/env/env.module';
import { CryptographyModule } from '@/@shared/cryptography/cryptography.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([AccountEntity]),
    EnvModule,
    CryptographyModule,
  ],
  controllers: [],
  providers: [
    /// //////////////////////////
    //  Repositories
    /// //////////////////////////
    {
      provide: IAccountsRepository,
      useClass: AccountsRepository,
    },

    /// //////////////////////////
    //  Services
    /// //////////////////////////
    {
      provide: TCreateAccountService,
      useClass: CreateAccountService,
    },

    /// //////////////////////////
    //  Presenters
    /// //////////////////////////
    {
      provide: IAccountPresenter,
      useClass: AccountPresenter,
    },
  ],
  exports: [
    /// //////////////////////////
    //  Repositories
    /// //////////////////////////
    IAccountsRepository,

    /// //////////////////////////
    //  Services
    /// //////////////////////////
    TCreateAccountService,

    /// //////////////////////////
    //  Presenters
    /// //////////////////////////
    IAccountPresenter,
  ],
})
export class AccountsModule {}
