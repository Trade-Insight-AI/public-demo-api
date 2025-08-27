import { Controller, Post, Param } from '@nestjs/common';
import { ApiDocumentation } from '@/@decorators/api-documentation.decorator';
import { ReqContext } from '@/@decorators/request-context.decorator';
import { AbstractApplicationException } from '@/@shared/errors/abstract-application-exception';
import { IRequestContext } from '@/@shared/protocols/request-context.struct';
import { TCancelBulkClassificationByGroupIdService } from '../../services/bulk/cancel-bulk-classification-by-group-id.service';
import { CancelBulkClassificationByGroupIdDocumentation } from '../../@docs/cancel-bulk-classification-by-group-id.doc';
import { ZodValidationPipe } from '@/@shared/pipes/zod-validation.pipe';
import {
  cancelBulkClassificationByGroupIdDtoParamSchema,
  TCancelBulkClassificationByGroupIdDtoParamSchema,
} from '../../dto/bulk/cancel-bulk-classification-by-group-id.dto';

@Controller('classifications/bulk/:groupId/cancel')
export class CancelBulkClassificationByGroupIdController {
  constructor(
    /// //////////////////////////
    //  Services
    /// //////////////////////////
    private service: TCancelBulkClassificationByGroupIdService,
  ) {}

  @Post()
  @ApiDocumentation(CancelBulkClassificationByGroupIdDocumentation)
  async handle(
    @ReqContext() context: IRequestContext,
    @Param(
      new ZodValidationPipe(cancelBulkClassificationByGroupIdDtoParamSchema),
    )
    params: TCancelBulkClassificationByGroupIdDtoParamSchema,
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
