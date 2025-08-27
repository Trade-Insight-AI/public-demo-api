import { Injectable } from '@nestjs/common';
import { ILogger } from '@/@shared/classes/custom-logger';
import { Result } from '@/@shared/classes/result';
import { AbstractService } from '@/@shared/classes/service';
import { IRequestContext } from '@/@shared/protocols/request-context.struct';
import { TTIAProvider } from '@/@shared/providers/tia-provider/models/tia-provider.struct';
import {
  TBulkClassificationStatusByGroupIdDtoServiceSchema,
  bulkClassificationStatusByGroupIdDtoServiceSchema,
} from '../../dto/bulk/bulk-classification-status-by-group-id.dto';
import { ITIAProviderBulkClassificationStatusByGroupIdResponse } from '@/@shared/providers/tia-provider/models/tia-provider-bulk-classify.struct';

export abstract class TBulkClassificationStatusByGroupIdService extends AbstractService<
  TBulkClassificationStatusByGroupIdDtoServiceSchema,
  ITIAProviderBulkClassificationStatusByGroupIdResponse
> {}

@Injectable()
export class BulkClassificationStatusByGroupIdService
  implements TBulkClassificationStatusByGroupIdService
{
  constructor(
    /// //////////////////////////
    //  Providers
    /// //////////////////////////
    private tiaProvider: TTIAProvider,

    public logger: ILogger,
  ) {
    this.logger.setContextName(BulkClassificationStatusByGroupIdService.name);
  }

  async execute(
    serviceDto: TBulkClassificationStatusByGroupIdDtoServiceSchema,
    context?: IRequestContext,
  ): Promise<Result<ITIAProviderBulkClassificationStatusByGroupIdResponse>> {
    const validateDtoResult = this.validateDto(serviceDto);

    if (validateDtoResult.error) {
      return Result.fail(validateDtoResult.error);
    }

    const validatedDto = validateDtoResult.getValue()!;

    this.logger.log(
      `Bulk classification status by group ID: ${validatedDto.groupId}`,
      context,
    );

    const bulkClassificationStatusResult =
      await this.tiaProvider.bulkClassificationStatusByGroupId(
        validatedDto.groupId,
      );

    if (bulkClassificationStatusResult.error) {
      const throwError = bulkClassificationStatusResult.error;

      this.logger.warn(throwError.message, context);

      return Result.fail(throwError);
    }

    return Result.success(bulkClassificationStatusResult.getValue()!);
  }

  validateDto(
    serviceDto: TBulkClassificationStatusByGroupIdDtoServiceSchema,
  ): Result<TBulkClassificationStatusByGroupIdDtoServiceSchema> {
    try {
      const validatedDto =
        bulkClassificationStatusByGroupIdDtoServiceSchema.parse(serviceDto);

      return Result.success(validatedDto);
    } catch (error) {
      return Result.fail(error as Error);
    }
  }
}
