import {
  ArgumentMetadata,
  BadRequestException,
  PipeTransform,
} from '@nestjs/common';

import { ZodSchema, ZodError } from 'zod';

export class ZodValidationPipe implements PipeTransform {
  constructor(private schema: ZodSchema) {}

  transform(value: any, metadata: ArgumentMetadata) {
    try {
      const parsedValue = this.schema.parse(value);
      return parsedValue;
    } catch (error) {
      if (error instanceof ZodError) {
        const errorMessage = this.formatErrorMessage(error);

        throw new BadRequestException(errorMessage);
      }
    }
  }

  private formatErrorMessage(error: ZodError): string {
    const firstError = error.errors[0];
    if (firstError?.path) {
      // If the error has a path (indicating which key failed validation)
      return `Validation failed for ${firstError.path.join('.')}: ${firstError.message}`;
    } else {
      const message = firstError?.message ?? 'Unknown error';
      // If the error doesn't have a path (indicating a general validation error)
      return 'Validation failed: ' + message;
    }
  }
}
