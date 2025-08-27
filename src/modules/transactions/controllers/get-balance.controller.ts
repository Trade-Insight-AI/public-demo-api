import { Controller, Get } from '@nestjs/common';
import { AbstractApplicationException } from '@/@shared/errors/abstract-application-exception';
import { ApiDocumentation } from '@/@decorators/api-documentation.decorator';
import { TGetBalanceService } from '../services/get-balance.service';
import { ReqContext } from '@/@decorators/request-context.decorator';
import { IRequestContext } from '@/@shared/protocols/request-context.struct';
import { GetBalanceDocumentation } from '../@docs/get-balance.doc';

@Controller('transactions/balance')
export class GetBalanceController {
  constructor(private getBalanceService: TGetBalanceService) {}

  @Get()
  @ApiDocumentation(GetBalanceDocumentation)
  async getBalance(@ReqContext() context: IRequestContext) {
    const result = await this.getBalanceService.execute(undefined, context);

    if (result.error) {
      if (result.error instanceof AbstractApplicationException) {
        result.error.context = context;
      }

      throw result.error;
    }

    return result.getValue()!;
  }
}
