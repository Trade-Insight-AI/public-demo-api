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

@Module({
  imports: [TIAProviderModule],
  controllers: [
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
