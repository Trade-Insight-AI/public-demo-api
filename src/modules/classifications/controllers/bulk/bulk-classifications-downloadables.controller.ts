import { Controller, Get } from '@nestjs/common';
import { ApiDocumentation } from '@/@decorators/api-documentation.decorator';
import { ReqContext } from '@/@decorators/request-context.decorator';
import { AbstractApplicationException } from '@/@shared/errors/abstract-application-exception';
import { IRequestContext } from '@/@shared/protocols/request-context.struct';
import { TBulkClassificationsDownloadablesService } from '../../services/bulk/bulk-classifications-downloadables.service';
import { BulkClassificationsDownloadablesDocumentation } from '../../@docs/bulk-classifications-downloadables.doc';

@Controller('classifications/bulk/downloadables')
export class BulkClassificationsDownloadablesController {
  constructor(
    /// //////////////////////////
    //  Services
    /// //////////////////////////
    private service: TBulkClassificationsDownloadablesService,
  ) {}

  @Get()
  @ApiDocumentation(BulkClassificationsDownloadablesDocumentation)
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
