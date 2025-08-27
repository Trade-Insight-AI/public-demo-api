import { ApiDocumentation } from '@/@decorators/api-documentation.decorator';
import { ReqContext } from '@/@decorators/request-context.decorator';
import { AbstractApplicationException } from '@/@shared/errors/abstract-application-exception';
import { IRequestContext } from '@/@shared/protocols/request-context.struct';
import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  FileValidationFileSize,
  FileValidationInterceptor,
} from '@/@interceptors/file-validation.interceptor';
import { ZodValidationPipe } from '@/@shared/pipes/zod-validation.pipe';
import {
  bulkClassifyDtoBodySchema,
  TBulkClassifyDtoBodySchema,
} from '../../dto/bulk/bulk-classify.dto';
import { TBulkClassifyService } from '../../services/bulk/bulk-classify.service';
import { BulkClassifyDocumentation } from '../../@docs/bulk-classify.doc';

@Controller('classifications/bulk-classify')
export class BulkClassifyController {
  constructor(
    /// //////////////////////////
    //  Services
    /// //////////////////////////
    private service: TBulkClassifyService,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiDocumentation(BulkClassifyDocumentation)
  @UseInterceptors(
    FileInterceptor('file', {
      limits: {
        fileSize: FileValidationFileSize['10MB'],
      },
    }),

    new FileValidationInterceptor(),
  )
  async handle(
    @ReqContext() context: IRequestContext,

    @Body(new ZodValidationPipe(bulkClassifyDtoBodySchema))
    body: TBulkClassifyDtoBodySchema,

    @UploadedFile()
    file: Multer.File,
  ) {
    const result = await this.service.execute(
      {
        ...body,
        file,
      },
      context,
    );

    if (result.error) {
      if (result.error instanceof AbstractApplicationException) {
        result.error.context = context;
      }

      throw result.error;
    }

    return result.getValue();
  }
}
