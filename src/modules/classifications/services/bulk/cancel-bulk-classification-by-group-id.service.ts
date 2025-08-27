import { Injectable } from '@nestjs/common';
import { ILogger } from '@/@shared/classes/custom-logger';
import { Result } from '@/@shared/classes/result';
import { AbstractService } from '@/@shared/classes/service';
import { IRequestContext } from '@/@shared/protocols/request-context.struct';
import { TTIAProvider } from '@/@shared/providers/tia-provider/models/tia-provider.struct';
import {
  TCancelBulkClassificationByGroupIdDtoServiceSchema,
  cancelBulkClassificationByGroupIdDtoServiceSchema,
} from '../../dto/bulk/cancel-bulk-classification-by-group-id.dto';

export abstract class TCancelBulkClassificationByGroupIdService extends AbstractService<
  TCancelBulkClassificationByGroupIdDtoServiceSchema,
  { message: string }
> {}

@Injectable()
export class CancelBulkClassificationByGroupIdService
  implements TCancelBulkClassificationByGroupIdService
{
  constructor(
    /// //////////////////////////
    //  Providers
    /// //////////////////////////
    private tiaProvider: TTIAProvider,

    public logger: ILogger,
  ) {
    this.logger.setContextName(CancelBulkClassificationByGroupIdService.name);
  }

  async execute(
    serviceDto: TCancelBulkClassificationByGroupIdDtoServiceSchema,
    context?: IRequestContext,
  ): Promise<Result<{ message: string }>> {
    const validateDtoResult = this.validateDto(serviceDto);

    if (validateDtoResult.error) {
      return Result.fail(validateDtoResult.error);
    }

    const validatedDto = validateDtoResult.getValue()!;

    this.logger.log(
      `Cancel bulk classification by group ID: ${validatedDto.groupId}`,
      context,
    );

    const cancelResult =
      await this.tiaProvider.cancelBulkClassificationByGroupId(
        validatedDto.groupId,
      );

    if (cancelResult.error) {
      const throwError = cancelResult.error;

      this.logger.warn(throwError.message, context);

      return Result.fail(throwError);
    }

    return Result.success(cancelResult.getValue()!);
  }

  validateDto(
    serviceDto: TCancelBulkClassificationByGroupIdDtoServiceSchema,
  ): Result<TCancelBulkClassificationByGroupIdDtoServiceSchema> {
    try {
      const validatedDto =
        cancelBulkClassificationByGroupIdDtoServiceSchema.parse(serviceDto);

      return Result.success(validatedDto);
    } catch (error) {
      return Result.fail(error as Error);
    }
  }
}
