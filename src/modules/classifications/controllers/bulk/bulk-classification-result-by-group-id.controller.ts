import { Controller, Get, Param } from '@nestjs/common';
import { ApiDocumentation } from '@/@decorators/api-documentation.decorator';
import { ReqContext } from '@/@decorators/request-context.decorator';
import { AbstractApplicationException } from '@/@shared/errors/abstract-application-exception';
import { IRequestContext } from '@/@shared/protocols/request-context.struct';
import { TBulkClassificationResultByGroupIdService } from '../../services/bulk/bulk-classification-result-by-group-id.service';
import { BulkClassificationResultByGroupIdDocumentation } from '../../@docs/bulk-classification-result-by-group-id.doc';
import { ZodValidationPipe } from '@/@shared/pipes/zod-validation.pipe';
import {
  bulkClassificationResultByGroupIdDtoParamSchema,
  TBulkClassificationResultByGroupIdDtoParamSchema,
} from '../../dto/bulk/bulk-classification-result-by-group-id.dto';

@Controller('classifications/bulk/:groupId/result')
export class BulkClassificationResultByGroupIdController {
  constructor(
    /// //////////////////////////
    //  Services
    /// //////////////////////////
    private service: TBulkClassificationResultByGroupIdService,
  ) {}

  @Get()
  @ApiDocumentation(BulkClassificationResultByGroupIdDocumentation)
  async handle(
    @ReqContext() context: IRequestContext,

    @Param(
      new ZodValidationPipe(bulkClassificationResultByGroupIdDtoParamSchema),
    )
    params: TBulkClassificationResultByGroupIdDtoParamSchema,
  ) {
    const result = await this.service.execute({ ...params }, context);

    if (result.error) {
      if (result.error instanceof AbstractApplicationException) {
        result.error.context = context;
      }

      throw result.error;
    }

    return result.getValue();
  }
}
