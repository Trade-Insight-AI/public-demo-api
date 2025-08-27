import { Injectable } from '@nestjs/common';
import { ILogger } from '@/@shared/classes/custom-logger';
import { Result } from '@/@shared/classes/result';
import { AbstractService } from '@/@shared/classes/service';
import { IRequestContext } from '@/@shared/protocols/request-context.struct';
import { TTIAProvider } from '@/@shared/providers/tia-provider/models/tia-provider.struct';
import { ITIAProviderBulkClassifyQueueStatusesResponse } from '@/@shared/providers/tia-provider/models/tia-provider-bulk-classify.struct';

export abstract class TBulkClassifyQueueStatusesService extends AbstractService<
  void,
  ITIAProviderBulkClassifyQueueStatusesResponse
> {}

@Injectable()
export class BulkClassifyQueueStatusesService
  implements TBulkClassifyQueueStatusesService
{
  constructor(
    /// //////////////////////////
    //  Providers
    /// //////////////////////////
    private tiaProvider: TTIAProvider,

    public logger: ILogger,
  ) {
    this.logger.setContextName(BulkClassifyQueueStatusesService.name);
  }

  async execute(
    _: void,
    context?: IRequestContext,
  ): Promise<Result<ITIAProviderBulkClassifyQueueStatusesResponse>> {
    this.logger.log(`Bulk classify queue statuses`, context);

    const bulkClassifyQueueStatusesResult =
      await this.tiaProvider.bulkClassifyQueueStatuses();

    if (bulkClassifyQueueStatusesResult.error) {
      const throwError = bulkClassifyQueueStatusesResult.error;

      this.logger.warn(throwError.message, context);

      return Result.fail(throwError);
    }

    return Result.success(bulkClassifyQueueStatusesResult.getValue()!);
  }
}
