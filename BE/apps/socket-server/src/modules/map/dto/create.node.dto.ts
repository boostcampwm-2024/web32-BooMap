import { IsNumber, IsObject, IsOptional, IsString, ValidateNested } from 'class-validator';
import { LocationDto } from '.';
import { Expose, Type } from 'class-transformer';

export class CreateNodeDto {
  @Expose()
  @IsString()
  keyword: string;

  @Expose()
  @IsNumber()
  depth: number;

  @Expose()
  @IsObject()
  @ValidateNested()
  @Type(() => LocationDto)
  location: LocationDto;

  @Expose()
  @IsOptional()
  @IsNumber()
  parentId?: number;
}
