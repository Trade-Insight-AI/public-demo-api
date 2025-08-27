import { Controller, Get } from '@nestjs/common';
import { ApiDocumentation } from '@/@decorators/api-documentation.decorator';
import { ReqContext } from '@/@decorators/request-context.decorator';
import { AbstractApplicationException } from '@/@shared/errors/abstract-application-exception';
import { IRequestContext } from '@/@shared/protocols/request-context.struct';
import { TBulkClassifyQueueStatusesService } from '../../services/bulk/bulk-classify-queue-statuses.service';
import { BulkClassifyQueueStatusesDocumentation } from '../../@docs/bulk-classify-queue-statuses.doc';

@Controller('classifications/bulk/queue-statuses')
export class BulkClassifyQueueStatusesController {
  constructor(
    /// //////////////////////////
    //  Services
    /// //////////////////////////
    private service: TBulkClassifyQueueStatusesService,
  ) {}

  @Get()
  @ApiDocumentation(BulkClassifyQueueStatusesDocumentation)
  async handle(@ReqContext() context: IRequestContext) {
    const result = await this.service.execute(undefined, context);

    if (result.error) {
      if (result.error instanceof AbstractApplicationException) {
        result.error.context = context;
      }

      throw result.error;
    }

    return result.getValue();
  }
}
