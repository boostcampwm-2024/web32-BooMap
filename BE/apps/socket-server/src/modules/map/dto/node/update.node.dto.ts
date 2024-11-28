import { Expose, Type } from 'class-transformer';
import { IsArray, IsNumber, IsObject, IsString, ValidateNested } from 'class-validator';
import { LocationDto } from '..';

export class NodeDto {
  @Expose()
  @IsNumber()
  id: number;

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
  @IsArray()
  @IsNumber({}, { each: true })
  children: number[];
}
