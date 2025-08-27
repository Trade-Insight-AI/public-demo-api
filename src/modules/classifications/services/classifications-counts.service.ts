import { Injectable } from '@nestjs/common';
import { ILogger } from '@/@shared/classes/custom-logger';
import { Result } from '@/@shared/classes/result';
import { AbstractService } from '@/@shared/classes/service';
import { IRequestContext } from '@/@shared/protocols/request-context.struct';
import {
  ITIAProviderClassificationsCountsResponse,
  TTIAProvider,
} from '@/@shared/providers/tia-provider/models/tia-provider.struct';

export abstract class TClassificationsCountsService extends AbstractService<
  void,
  ITIAProviderClassificationsCountsResponse
> {}

@Injectable()
export class ClassificationsCountsService
  implements TClassificationsCountsService
{
  constructor(
    /// //////////////////////////
    //  Providers
    /// //////////////////////////
    private tiaProvider: TTIAProvider,

    public logger: ILogger,
  ) {
    this.logger.setContextName(ClassificationsCountsService.name);
  }

  async execute(
    _: void,
    context?: IRequestContext,
  ): Promise<Result<ITIAProviderClassificationsCountsResponse>> {
    const classificationsCountsResult =
      await this.tiaProvider.classificationsCounts();

    if (classificationsCountsResult.error) {
      const throwError = classificationsCountsResult.error;

      this.logger.warn(throwError.message, context);

      return Result.fail(throwError);
    }

    const classificationsCountsDetails =
      classificationsCountsResult.getValue()!;

    return Result.success(classificationsCountsDetails);
  }
}
