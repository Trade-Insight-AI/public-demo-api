import { Module } from '@nestjs/common';
import { ClassifyProductController } from './controllers/single-product/classify-product.controller';
import { TIAProviderModule } from '@/@shared/providers/tia-provider/tia-provider.module';
import { BulkClassifyController } from './controllers/bulk/bulk-classify.controller';
import {
  TClassifyProductService,
  ClassifyProductService,
} from './services/single-product/classify-product.service';
import {
  TBulkClassifyService,
  BulkClassifyService,
} from './services/bulk/bulk-classify.service';
import { ClassificationsCountsController } from './controllers/classifications-counts.controller';
import {
  TClassificationsCountsService,
  ClassificationsCountsService,
} from './services/classifications-counts.service';

@Module({
  imports: [TIAProviderModule],
  controllers: [
    ClassificationsCountsController,

    /// //////////////////////////
    //  Single Product
    /// //////////////////////////
    ClassifyProductController,

    /// //////////////////////////
    //  Bulk Classify
    /// //////////////////////////
    BulkClassifyController,
  ],
  providers: [
    /// //////////////////////////
    //  Services
    /// //////////////////////////
    {
      provide: TClassificationsCountsService,
      useClass: ClassificationsCountsService,
    },
    {
      provide: TClassifyProductService,
      useClass: ClassifyProductService,
    },
    {
      provide: TBulkClassifyService,
      useClass: BulkClassifyService,
    },
  ],
  exports: [TClassifyProductService, TBulkClassifyService],
})
export class ClassificationsModule {}
