import { Expose } from 'class-transformer';
import { IsArray } from 'class-validator';

export class nodeDeleteDto {
  @Expose()
  @IsArray()
  id: number[];
}
