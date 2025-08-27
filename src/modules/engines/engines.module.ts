import { Module } from '@nestjs/common';

// Services
import {
  TListEnginesService,
  ListEnginesService,
} from './services/list-engines.service';

// Controllers
import { ListEnginesController } from './controllers/list-engines.controller';
import { TIAProviderModule } from '@/@shared/providers/tia-provider/tia-provider.module';

@Module({
  imports: [TIAProviderModule],
  controllers: [
    /// //////////////////////////
    //  Engines
    /// //////////////////////////
    ListEnginesController,
  ],
  providers: [
    /// //////////////////////////
    //  Services
    /// //////////////////////////
    {
      provide: TListEnginesService,
      useClass: ListEnginesService,
    },
  ],
  exports: [
    /// //////////////////////////
    //  Services
    /// //////////////////////////
    TListEnginesService,
  ],
})
export class EnginesModule {}
