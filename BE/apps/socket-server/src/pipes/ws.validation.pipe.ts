import { Injectable, PipeTransform, ArgumentMetadata } from '@nestjs/common';
import { WsException } from '@nestjs/websockets';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';

@Injectable()
export class WsValidationPipe implements PipeTransform {
  async transform(value: any, metadata: ArgumentMetadata): Promise<any> {
    if (!value) {
      throw new WsException({
        code: 'VALIDATION_ERROR',
        message: 'No data provided',
      });
    }

    let parsedValue: any;
    try {
      parsedValue = typeof value === 'string' ? JSON.parse(value) : value;
    } catch (error) {
      throw new WsException({
        code: 'VALIDATION_ERROR',
        message: `Invalid JSON format: ${error.message}`,
      });
    }

    if (!metadata.metatype) {
      return parsedValue;
    }

    const object = plainToInstance(metadata.metatype, parsedValue, {
      excludeExtraneousValues: true,
    });

    const errors = await validate(object);

    if (errors.length > 0) {
      throw new WsException({
        code: 'VALIDATION_ERROR',
        message: 'Validation failed',
        details: errors.map((err) => ({
          property: err.property,
          constraints: err.constraints,
        })),
      });
    }

    return object;
  }
}
