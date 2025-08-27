import { ApiDocumentation } from '@/@decorators/api-documentation.decorator';
import { ReqContext } from '@/@decorators/request-context.decorator';
import { AbstractApplicationException } from '@/@shared/errors/abstract-application-exception';
import { IRequestContext } from '@/@shared/protocols/request-context.struct';
import { Body, Controller, Post } from '@nestjs/common';
import { ClassifyProductDocumentation } from '../../@docs/classify-product-documentation.doc';
import { ZodValidationPipe } from '@/@shared/pipes/zod-validation.pipe';
import {
  classifyProductDtoBodySchema,
  TClassifyProductDtoBodySchema,
} from '../../dto/single-product/classify-product.dto';
import { TClassifyProductService } from '../../services/single-product/classify-product.service';

@Controller('classifications/classify-product')
export class ClassifyProductController {
  constructor(
    /// //////////////////////////
    //  Services
    /// //////////////////////////
    private service: TClassifyProductService,
  ) {}

  @Post()
  @ApiDocumentation(ClassifyProductDocumentation)
  async handle(
    @ReqContext() context: IRequestContext,

    @Body(new ZodValidationPipe(classifyProductDtoBodySchema))
    body: TClassifyProductDtoBodySchema,
  ) {
    const result = await this.service.execute(body, context);

    if (result.error) {
      if (result.error instanceof AbstractApplicationException) {
        result.error.context = context;
      }

      throw result.error;
    }

    return result.getValue();
  }
}
