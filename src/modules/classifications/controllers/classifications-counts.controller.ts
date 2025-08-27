import { Controller, Get } from '@nestjs/common';
import { ApiDocumentation } from '@/@decorators/api-documentation.decorator';
import { ReqContext } from '@/@decorators/request-context.decorator';
import { AbstractApplicationException } from '@/@shared/errors/abstract-application-exception';
import { IRequestContext } from '@/@shared/protocols/request-context.struct';
import { TClassificationsCountsService } from '../services/classifications-counts.service';
import { ClassificationsCountsDocumentation } from '../@docs/classifications-counts.doc';

@Controller('classifications/counts')
export class ClassificationsCountsController {
  constructor(
    /// //////////////////////////
    //  Services
    /// //////////////////////////
    private service: TClassificationsCountsService,
  ) {}

  @Get()
  @ApiDocumentation(ClassificationsCountsDocumentation)
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
