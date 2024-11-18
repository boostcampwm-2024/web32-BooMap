import { IsArray } from 'class-validator';

export class nodeDeleteDto {
  @IsArray()
  id: number[];
}
