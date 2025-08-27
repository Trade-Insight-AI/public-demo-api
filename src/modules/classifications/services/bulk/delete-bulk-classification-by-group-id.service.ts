import { Injectable } from '@nestjs/common';
import { ILogger } from '@/@shared/classes/custom-logger';
import { Result } from '@/@shared/classes/result';
import { AbstractService } from '@/@shared/classes/service';
import { IRequestContext } from '@/@shared/protocols/request-context.struct';
import { TTIAProvider } from '@/@shared/providers/tia-provider/models/tia-provider.struct';
import {
  TDeleteBulkClassificationByGroupIdDtoServiceSchema,
  deleteBulkClassificationByGroupIdDtoServiceSchema,
} from '../../dto/bulk/delete-bulk-classification-by-group-id.dto';

export abstract class TDeleteBulkClassificationByGroupIdService extends AbstractService<
  TDeleteBulkClassificationByGroupIdDtoServiceSchema,
  { message: string }
> {}

@Injectable()
export class DeleteBulkClassificationByGroupIdService
  implements TDeleteBulkClassificationByGroupIdService
{
  constructor(
    /// //////////////////////////
    //  Providers
    /// //////////////////////////
    private tiaProvider: TTIAProvider,

    public logger: ILogger,
  ) {
    this.logger.setContextName(DeleteBulkClassificationByGroupIdService.name);
  }

  async execute(
    serviceDto: TDeleteBulkClassificationByGroupIdDtoServiceSchema,
    context?: IRequestContext,
  ): Promise<Result<{ message: string }>> {
    const validateDtoResult = this.validateDto(serviceDto);

    if (validateDtoResult.error) {
      return Result.fail(validateDtoResult.error);
    }

    const validatedDto = validateDtoResult.getValue()!;

    this.logger.log(
      `Delete bulk classification by group ID: ${validatedDto.groupId}`,
      context,
    );

    const deleteResult =
      await this.tiaProvider.deleteBulkClassificationByGroupId(
        validatedDto.groupId,
      );

    if (deleteResult.error) {
      const throwError = deleteResult.error;

      this.logger.warn(throwError.message, context);

      return Result.fail(throwError);
    }

    return Result.success(deleteResult.getValue()!);
  }

  validateDto(
    serviceDto: TDeleteBulkClassificationByGroupIdDtoServiceSchema,
  ): Result<TDeleteBulkClassificationByGroupIdDtoServiceSchema> {
    try {
      const validatedDto =
        deleteBulkClassificationByGroupIdDtoServiceSchema.parse(serviceDto);

      return Result.success(validatedDto);
    } catch (error) {
      return Result.fail(error as Error);
    }
  }
}
