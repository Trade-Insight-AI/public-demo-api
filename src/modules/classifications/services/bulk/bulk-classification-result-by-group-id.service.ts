import { Injectable } from '@nestjs/common';
import { ILogger } from '@/@shared/classes/custom-logger';
import { Result } from '@/@shared/classes/result';
import { AbstractService } from '@/@shared/classes/service';
import { IRequestContext } from '@/@shared/protocols/request-context.struct';
import { TTIAProvider } from '@/@shared/providers/tia-provider/models/tia-provider.struct';
import {
  TBulkClassificationResultByGroupIdDtoServiceSchema,
  bulkClassificationResultByGroupIdDtoServiceSchema,
} from '../../dto/bulk/bulk-classification-result-by-group-id.dto';
import { ITIAProviderBulkClassificationResultByGroupIdResponse } from '@/@shared/providers/tia-provider/models/tia-provider-bulk-classify.struct';

export abstract class TBulkClassificationResultByGroupIdService extends AbstractService<
  TBulkClassificationResultByGroupIdDtoServiceSchema,
  ITIAProviderBulkClassificationResultByGroupIdResponse
> {}

@Injectable()
export class BulkClassificationResultByGroupIdService
  implements TBulkClassificationResultByGroupIdService
{
  constructor(
    /// //////////////////////////
    //  Providers
    /// //////////////////////////
    private tiaProvider: TTIAProvider,

    public logger: ILogger,
  ) {
    this.logger.setContextName(BulkClassificationResultByGroupIdService.name);
  }

  async execute(
    serviceDto: TBulkClassificationResultByGroupIdDtoServiceSchema,
    context?: IRequestContext,
  ): Promise<Result<ITIAProviderBulkClassificationResultByGroupIdResponse>> {
    const validateDtoResult = this.validateDto(serviceDto);

    if (validateDtoResult.error) {
      return Result.fail(validateDtoResult.error);
    }

    const validatedDto = validateDtoResult.getValue()!;

    this.logger.log(
      `Bulk classification result by group ID: ${validatedDto.groupId}`,
      context,
    );

    const bulkClassificationResult =
      await this.tiaProvider.bulkClassificationResultByGroupId(
        validatedDto.groupId,
      );

    if (bulkClassificationResult.error) {
      const throwError = bulkClassificationResult.error;

      this.logger.warn(throwError.message, context);

      return Result.fail(throwError);
    }

    return Result.success(bulkClassificationResult.getValue()!);
  }

  validateDto(
    serviceDto: TBulkClassificationResultByGroupIdDtoServiceSchema,
  ): Result<TBulkClassificationResultByGroupIdDtoServiceSchema> {
    try {
      const validatedDto =
        bulkClassificationResultByGroupIdDtoServiceSchema.parse(serviceDto);

      return Result.success(validatedDto);
    } catch (error) {
      return Result.fail(error as Error);
    }
  }
}
