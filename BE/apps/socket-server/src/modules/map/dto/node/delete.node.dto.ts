import { Expose } from 'class-transformer';
import { IsArray } from 'class-validator';

export class DeleteNodeDto {
  @Expose()
  @IsArray()
  id: number[];
}
