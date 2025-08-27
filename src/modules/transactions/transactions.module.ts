import { Module } from '@nestjs/common';

// Services
import {
  TGetBalanceService,
  GetBalanceService,
} from './services/get-balance.service';

// Controllers
import { GetBalanceController } from './controllers/get-balance.controller';
import { TIAProviderModule } from '@/@shared/providers/tia-provider/tia-provider.module';

@Module({
  imports: [TIAProviderModule],
  controllers: [
    /// //////////////////////////
    //  Transactions
    /// //////////////////////////
    GetBalanceController,
  ],
  providers: [
    /// //////////////////////////
    //  Services
    /// //////////////////////////
    {
      provide: TGetBalanceService,
      useClass: GetBalanceService,
    },
  ],
  exports: [
    /// //////////////////////////
    //  Services
    /// //////////////////////////
    TGetBalanceService,
  ],
})
export class TransactionsModule {}
