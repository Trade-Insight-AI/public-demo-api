import { Injectable } from '@nestjs/common';
import { ILogger } from '@/@shared/classes/custom-logger';
import { Result } from '@/@shared/classes/result';
import { AbstractService } from '@/@shared/classes/service';
import {
  ITIAProviderListEnginesResponse,
  TTIAProvider,
} from '@/@shared/providers/tia-provider/models/tia-provider.struct';

import { IRequestContext } from '@/@shared/protocols/request-context.struct';

export abstract class TListEnginesService extends AbstractService<
  void,
  ITIAProviderListEnginesResponse
> {}

@Injectable()
export class ListEnginesService implements TListEnginesService {
  constructor(
    /// //////////////////////////
    //  Providers
    /// //////////////////////////
    private tiaProvider: TTIAProvider,
    public logger: ILogger,
  ) {
    this.logger.setContextName(ListEnginesService.name);
  }

  async execute(
    _,
    context?: IRequestContext,
  ): Promise<Result<ITIAProviderListEnginesResponse>> {
    this.logger.log('Listing engines');

    const listEnginesResult = await this.tiaProvider.listEngines();

    if (listEnginesResult.error) {
      const throwError = listEnginesResult.error;

      this.logger.warn(throwError.message, context);

      return Result.fail(throwError);
    }

    return Result.success(listEnginesResult.getValue()!);
  }
}
