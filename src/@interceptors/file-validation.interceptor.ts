import { DefaultException } from '@/@shared/errors/abstract-application-exception';
import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';

export enum AllowedMimeTypesEnum {
  CSV = 'text/csv',
}

export const FileValidationFileSize = {
  '2MB': 2 * 1024 * 1024,
  '5MB': 5 * 1024 * 1024,
  '10MB': 10 * 1024 * 1024,
  '20MB': 20 * 1024 * 1024,
};

@Injectable()
export class FileValidationInterceptor implements NestInterceptor {
  constructor(
    private readonly allowedMimeTypes: AllowedMimeTypesEnum[] = [
      AllowedMimeTypesEnum.CSV,
    ],
    private readonly isRequired: boolean = true,
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const file = request.file;

    if (!file && this.isRequired) {
      throw new DefaultException('File required');
    }

    if (file) {
      // Validar tipo de arquivo
      const allowedMimeTypesValues = this.allowedMimeTypes.map(
        (type) => type as string,
      );

      if (!allowedMimeTypesValues.includes(file.mimetype as string)) {
        const allowedTypesString = this.getAllowedTypesString();
        throw new DefaultException(
          `File type not allowed. Only ${allowedTypesString} are accepted.`,
        );
      }
    }

    return next.handle();
  }

  private getAllowedTypesString(): string {
    const typeNames = this.allowedMimeTypes.map((type) => {
      switch (type) {
        case AllowedMimeTypesEnum.CSV:
          return 'CSV';
        default:
          return type;
      }
    });

    if (typeNames.length === 1) {
      return typeNames[0];
    }

    if (typeNames.length === 2) {
      return `${typeNames[0]} and ${typeNames[1]}`;
    }

    return `${typeNames.slice(0, -1).join(', ')} and ${typeNames[typeNames.length - 1]}`;
  }
}
