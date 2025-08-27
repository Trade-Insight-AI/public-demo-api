import { Module } from '@nestjs/common';
import {
  ClassifyProductService,
  TClassifyProductService,
} from './services/classify-product.service';
import { ClassifyProductController } from './controllers/classify-product.controller';
import { TIAProviderModule } from '@/@shared/providers/tia-provider/tia-provider.module';

@Module({
  imports: [TIAProviderModule],
  controllers: [ClassifyProductController],
  providers: [
    /// //////////////////////////
    //  Services
    /// //////////////////////////
    {
      provide: TClassifyProductService,
      useClass: ClassifyProductService,
    },
  ],
  exports: [TClassifyProductService],
})
export class ClassificationsModule {}
