import { Module } from '@nestjs/common';
import { ClassifyProductController } from './controllers/single-product/classify-product.controller';
import { TIAProviderModule } from '@/@shared/providers/tia-provider/tia-provider.module';
import { BulkClassifyController } from './controllers/bulk/bulk-classify.controller';
import { BulkClassifyQueueStatusesController } from './controllers/bulk/bulk-classify-queue-statuses.controller';
import { BulkClassificationsDownloadablesController } from './controllers/bulk/bulk-classifications-downloadables.controller';
import { BulkClassificationStatusByGroupIdController } from './controllers/bulk/bulk-classification-status-by-group-id.controller';
import { DeleteBulkClassificationByGroupIdController } from './controllers/bulk/delete-bulk-classification-by-group-id.controller';
import { BulkClassificationResultByGroupIdController } from './controllers/bulk/bulk-classification-result-by-group-id.controller';
import { CancelBulkClassificationByGroupIdController } from './controllers/bulk/cancel-bulk-classification-by-group-id.controller';
import {
  TClassifyProductService,
  ClassifyProductService,
} from './services/single-product/classify-product.service';
import {
  TBulkClassifyService,
  BulkClassifyService,
} from './services/bulk/bulk-classify.service';
import {
  TBulkClassifyQueueStatusesService,
  BulkClassifyQueueStatusesService,
} from './services/bulk/bulk-classify-queue-statuses.service';
import {
  TBulkClassificationsDownloadablesService,
  BulkClassificationsDownloadablesService,
} from './services/bulk/bulk-classifications-downloadables.service';
import {
  TBulkClassificationStatusByGroupIdService,
  BulkClassificationStatusByGroupIdService,
} from './services/bulk/bulk-classification-status-by-group-id.service';
import {
  TDeleteBulkClassificationByGroupIdService,
  DeleteBulkClassificationByGroupIdService,
} from './services/bulk/delete-bulk-classification-by-group-id.service';
import {
  TBulkClassificationResultByGroupIdService,
  BulkClassificationResultByGroupIdService,
} from './services/bulk/bulk-classification-result-by-group-id.service';
import {
  TCancelBulkClassificationByGroupIdService,
  CancelBulkClassificationByGroupIdService,
} from './services/bulk/cancel-bulk-classification-by-group-id.service';

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
    BulkClassifyQueueStatusesController,
    BulkClassificationsDownloadablesController,
    BulkClassificationStatusByGroupIdController,
    DeleteBulkClassificationByGroupIdController,
    BulkClassificationResultByGroupIdController,
    CancelBulkClassificationByGroupIdController,
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
    {
      provide: TBulkClassifyQueueStatusesService,
      useClass: BulkClassifyQueueStatusesService,
    },
    {
      provide: TBulkClassificationsDownloadablesService,
      useClass: BulkClassificationsDownloadablesService,
    },
    {
      provide: TBulkClassificationStatusByGroupIdService,
      useClass: BulkClassificationStatusByGroupIdService,
    },
    {
      provide: TDeleteBulkClassificationByGroupIdService,
      useClass: DeleteBulkClassificationByGroupIdService,
    },
    {
      provide: TBulkClassificationResultByGroupIdService,
      useClass: BulkClassificationResultByGroupIdService,
    },
    {
      provide: TCancelBulkClassificationByGroupIdService,
      useClass: CancelBulkClassificationByGroupIdService,
    },
  ],
  exports: [
    TClassifyProductService,
    TBulkClassifyService,
    TBulkClassifyQueueStatusesService,
    TBulkClassificationsDownloadablesService,
    TBulkClassificationStatusByGroupIdService,
    TDeleteBulkClassificationByGroupIdService,
    TBulkClassificationResultByGroupIdService,
    TCancelBulkClassificationByGroupIdService,
  ],
})
export class ClassificationsModule {}
