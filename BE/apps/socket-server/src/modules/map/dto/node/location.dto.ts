import { Expose } from 'class-transformer';
import { IsNumber } from 'class-validator';

export class LocationDto {
  @Expose()
  @IsNumber()
  x: number;

  @Expose()
  @IsNumber()
  y: number;
}
