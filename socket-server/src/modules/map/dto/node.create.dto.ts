import { IsNumber, IsObject, IsOptional, IsString, ValidateNested } from 'class-validator';
import { LocationDto } from '.';
import { Type } from 'class-transformer';

export class NodeCreateDto {
  @IsString()
  keyword: string;

  @IsNumber()
  depth: number;

  @IsObject()
  @ValidateNested()
  @Type(() => LocationDto)
  location: LocationDto;

  @IsOptional()
  @IsNumber()
  parentId?: number;
}
