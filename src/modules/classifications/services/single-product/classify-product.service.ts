import { Injectable } from '@nestjs/common';
import { ILogger } from '@/@shared/classes/custom-logger';
import { Result } from '@/@shared/classes/result';
import { AbstractService } from '@/@shared/classes/service';
import { IRequestContext } from '@/@shared/protocols/request-context.struct';
import { TTIAProvider } from '@/@shared/providers/tia-provider/models/tia-provider.struct';
import { ITIAProviderClassifyProductDetails } from '@/@shared/providers/tia-provider/models/tia-provider-classify-product.struct';
import {
  TClassifyProductDtoServiceSchema,
  classifyProductDtoServiceSchema,
} from '../../dto/single-product/classify-product.dto';

export abstract class TClassifyProductService extends AbstractService<
  TClassifyProductDtoServiceSchema,
  ITIAProviderClassifyProductDetails
> {}

@Injectable()
export class ClassifyProductService implements TClassifyProductService {
  constructor(
    /// //////////////////////////
    //  Providers
    /// //////////////////////////
    private tiaProvider: TTIAProvider,

    public logger: ILogger,
  ) {
    this.logger.setContextName(ClassifyProductService.name);
  }

  async execute(
    serviceDto: TClassifyProductDtoServiceSchema,
    context?: IRequestContext,
  ): Promise<Result<ITIAProviderClassifyProductDetails>> {
    const validateDtoResult = this.validateDto(serviceDto);

    if (validateDtoResult.error) {
      return Result.fail(validateDtoResult.error);
    }

    const { engine, productDescription, mockDelay, testMode } =
      validateDtoResult.getValue()!;

    this.logger.log(
      `Classifying product: ${JSON.stringify({
        productDescription: productDescription,
        engine: engine,
        testMode: testMode,
        mockDelay: mockDelay,
      })}`,
      context,
    );

    const classifyProductResult = await this.tiaProvider.classifyProduct({
      engine,
      productDescription,
      mockDelay,
      testMode,
    });

    if (classifyProductResult.error) {
      const throwError = classifyProductResult.error;

      this.logger.warn(throwError.message, context);

      return Result.fail(throwError);
    }

    const classifyProductDetails = classifyProductResult.getValue()!;

    return Result.success(classifyProductDetails);
  }

  validateDto(
    serviceDto: TClassifyProductDtoServiceSchema,
  ): Result<TClassifyProductDtoServiceSchema> {
    try {
      const validatedDto = classifyProductDtoServiceSchema.parse(serviceDto);

      return Result.success(validatedDto);
    } catch (error) {
      return Result.fail(error as Error);
    }
  }
}
