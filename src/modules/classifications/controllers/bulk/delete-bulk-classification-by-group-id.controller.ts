import { Controller, Delete, Param } from '@nestjs/common';
import { ApiDocumentation } from '@/@decorators/api-documentation.decorator';
import { ReqContext } from '@/@decorators/request-context.decorator';
import { AbstractApplicationException } from '@/@shared/errors/abstract-application-exception';
import { IRequestContext } from '@/@shared/protocols/request-context.struct';
import { TDeleteBulkClassificationByGroupIdService } from '../../services/bulk/delete-bulk-classification-by-group-id.service';
import { DeleteBulkClassificationByGroupIdDocumentation } from '../../@docs/delete-bulk-classification-by-group-id.doc';
import { ZodValidationPipe } from '@/@shared/pipes/zod-validation.pipe';
import {
  deleteBulkClassificationByGroupIdDtoParamSchema,
  TDeleteBulkClassificationByGroupIdDtoParamSchema,
} from '../../dto/bulk/delete-bulk-classification-by-group-id.dto';

@Controller('classifications/bulk/:groupId/delete')
export class DeleteBulkClassificationByGroupIdController {
  constructor(
    /// //////////////////////////
    //  Services
    /// //////////////////////////
    private service: TDeleteBulkClassificationByGroupIdService,
  ) {}

  @Delete()
  @ApiDocumentation(DeleteBulkClassificationByGroupIdDocumentation)
  async handle(
    @ReqContext() context: IRequestContext,
    @Param(
      new ZodValidationPipe(deleteBulkClassificationByGroupIdDtoParamSchema),
    )
    params: TDeleteBulkClassificationByGroupIdDtoParamSchema,
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
