import { Injectable, PipeTransform, BadRequestException } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { NodeDto } from 'src/modules/map/dto';

@Injectable()
export class MindmapValidationPipe implements PipeTransform {
  async transform(value: any): Promise<any> {
    try {
      const parsedValue = typeof value === 'string' ? JSON.parse(value) : value;

      for (const [key, nodeData] of Object.entries(parsedValue)) {
        const node = plainToInstance(NodeDto, nodeData);
        const errors = await validate(node);

        if (errors.length) {
          const errorMessages = errors
            .map((err) => Object.values(err.constraints))
            .flat()
            .join(', ');
          throw new BadRequestException(`Validation failed for node ${key}: ${errorMessages}`);
        }
      }

      return parsedValue;
    } catch (error) {
      if (error instanceof BadRequestException) throw error;
      throw new BadRequestException('Invalid mindmap data format');
    }
  }
}
