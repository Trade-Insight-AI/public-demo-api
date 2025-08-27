import { Controller, Get } from '@nestjs/common';
import { AbstractApplicationException } from '@/@shared/errors/abstract-application-exception';
import { ApiDocumentation } from '@/@decorators/api-documentation.decorator';
import { TListEnginesService } from '../services/list-engines.service';
import { ListEnginesDocumentation } from '../@docs/list-engines.doc.js';
import { ReqContext } from '@/@decorators/request-context.decorator';
import { IRequestContext } from '@/@shared/protocols/request-context.struct';

@Controller('engines')
export class ListEnginesController {
  constructor(private listEnginesService: TListEnginesService) {}

  @Get()
  @ApiDocumentation(ListEnginesDocumentation)
  async listEngines(@ReqContext() context: IRequestContext) {
    const result = await this.listEnginesService.execute(undefined, context);

    if (result.error) {
      if (result.error instanceof AbstractApplicationException) {
        result.error.context = context;
      }

      throw result.error;
    }

    return result.getValue()!;
  }
}
