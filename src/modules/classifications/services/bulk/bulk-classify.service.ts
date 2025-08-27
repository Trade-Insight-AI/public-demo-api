import { Injectable } from '@nestjs/common';
import { ILogger } from '@/@shared/classes/custom-logger';
import { Result } from '@/@shared/classes/result';
import { AbstractService } from '@/@shared/classes/service';
import { IRequestContext } from '@/@shared/protocols/request-context.struct';
import { TTIAProvider } from '@/@shared/providers/tia-provider/models/tia-provider.struct';
import {
  TBulkClassifyDtoServiceSchema,
  bulkClassifyDtoServiceSchema,
} from '../../dto/bulk/bulk-classify.dto';
import { ITIAProviderBulkClassifyResponse } from '@/@shared/providers/tia-provider/models/tia-provider-bulk-classify.struct';

export abstract class TBulkClassifyService extends AbstractService<
  TBulkClassifyDtoServiceSchema,
  ITIAProviderBulkClassifyResponse
> {}

@Injectable()
export class BulkClassifyService implements TBulkClassifyService {
  constructor(
    /// //////////////////////////
    //  Providers
    /// //////////////////////////
    private tiaProvider: TTIAProvider,

    public logger: ILogger,
  ) {
    this.logger.setContextName(BulkClassifyService.name);
  }

  async execute(
    serviceDto: TBulkClassifyDtoServiceSchema,
    context?: IRequestContext,
  ): Promise<Result<ITIAProviderBulkClassifyResponse>> {
    const validateDtoResult = this.validateDto(serviceDto);

    if (validateDtoResult.error) {
      return Result.fail(validateDtoResult.error);
    }

    const validatedDto = validateDtoResult.getValue()!;

    this.logger.log(
      `Bulk classifying: ${JSON.stringify({
        ...validatedDto,
        file: validatedDto.file.originalname,
        'typeof forceReprocess': typeof validatedDto.forceReprocess,
      })}`,
      context,
    );

    const bulkClassifyResult =
      await this.tiaProvider.bulkClassify(validatedDto);

    if (bulkClassifyResult.error) {
      const throwError = bulkClassifyResult.error;

      this.logger.warn(throwError.message, context);

      return Result.fail(throwError);
    }

    return Result.success(bulkClassifyResult.getValue()!);
  }

  validateDto(
    serviceDto: TBulkClassifyDtoServiceSchema,
  ): Result<TBulkClassifyDtoServiceSchema> {
    try {
      const validatedDto = bulkClassifyDtoServiceSchema.parse(serviceDto);

      return Result.success(validatedDto);
    } catch (error) {
      return Result.fail(error as Error);
    }
  }
}
