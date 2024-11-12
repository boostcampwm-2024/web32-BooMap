import { IsNumber } from 'class-validator';

export class LocationDto {
  @IsNumber()
  x: number;

  @IsNumber()
  y: number;
}
