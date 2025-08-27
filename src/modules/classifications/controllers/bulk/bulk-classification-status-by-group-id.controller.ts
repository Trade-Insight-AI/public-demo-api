import { Controller, Get, Param } from '@nestjs/common';
import { ApiDocumentation } from '@/@decorators/api-documentation.decorator';
import { ReqContext } from '@/@decorators/request-context.decorator';
import { AbstractApplicationException } from '@/@shared/errors/abstract-application-exception';
import { IRequestContext } from '@/@shared/protocols/request-context.struct';
import { TBulkClassificationStatusByGroupIdService } from '../../services/bulk/bulk-classification-status-by-group-id.service';
import { BulkClassificationStatusByGroupIdDocumentation } from '../../@docs/bulk-classification-status-by-group-id.doc';
import { ZodValidationPipe } from '@/@shared/pipes/zod-validation.pipe';
import {
  bulkClassificationStatusByGroupIdDtoParamSchema,
  TBulkClassificationStatusByGroupIdDtoParamSchema,
} from '../../dto/bulk/bulk-classification-status-by-group-id.dto';

@Controller('classifications/bulk/:groupId/status')
export class BulkClassificationStatusByGroupIdController {
  constructor(
    /// //////////////////////////
    //  Services
    /// //////////////////////////
    private service: TBulkClassificationStatusByGroupIdService,
  ) {}

  @Get()
  @ApiDocumentation(BulkClassificationStatusByGroupIdDocumentation)
  async handle(
    @ReqContext() context: IRequestContext,

    @Param(
      new ZodValidationPipe(bulkClassificationStatusByGroupIdDtoParamSchema),
    )
    params: TBulkClassificationStatusByGroupIdDtoParamSchema,
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
