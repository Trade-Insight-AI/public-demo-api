import { Injectable } from '@nestjs/common';
import { ILogger } from '@/@shared/classes/custom-logger';
import { Result } from '@/@shared/classes/result';
import { AbstractService } from '@/@shared/classes/service';
import { IRequestContext } from '@/@shared/protocols/request-context.struct';
import { TTIAProvider } from '@/@shared/providers/tia-provider/models/tia-provider.struct';
import { ITIAProviderBulkClassificationsDownloadables } from '@/@shared/providers/tia-provider/models/tia-provider-bulk-classify.struct';

export abstract class TBulkClassificationsDownloadablesService extends AbstractService<
  void,
  ITIAProviderBulkClassificationsDownloadables
> {}

@Injectable()
export class BulkClassificationsDownloadablesService
  implements TBulkClassificationsDownloadablesService
{
  constructor(
    /// //////////////////////////
    //  Providers
    /// //////////////////////////
    private tiaProvider: TTIAProvider,

    public logger: ILogger,
  ) {
    this.logger.setContextName(BulkClassificationsDownloadablesService.name);
  }

  async execute(
    _: void,
    context?: IRequestContext,
  ): Promise<Result<ITIAProviderBulkClassificationsDownloadables>> {
    this.logger.log(`Bulk classifications downloadables`, context);

    const bulkClassificationsDownloadablesResult =
      await this.tiaProvider.bulkClassificationsDownloadables();

    if (bulkClassificationsDownloadablesResult.error) {
      const throwError = bulkClassificationsDownloadablesResult.error;

      this.logger.warn(throwError.message, context);

      return Result.fail(throwError);
    }

    return Result.success(bulkClassificationsDownloadablesResult.getValue()!);
  }
}
