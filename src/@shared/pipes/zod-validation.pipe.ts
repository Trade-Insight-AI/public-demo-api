import { PipeTransform } from '@nestjs/common';
import { ZodError, ZodSchema } from 'zod';

export class ZodValidationPipe implements PipeTransform {
  constructor(private schema: ZodSchema) {}

  transform<T>(value: unknown): T {
    try {
      return this.schema.parse(value) as T;
    } catch (error) {
      if (error instanceof ZodError) {
        // Re-throw ZodError to be handled by the exception filter
        throw error;
      }

      // For other types of errors, create a generic ZodError
      throw new ZodError([
        {
          code: 'custom',
          path: [],
          message: 'Validation failed',
        },
      ]);
    }
  }
}
