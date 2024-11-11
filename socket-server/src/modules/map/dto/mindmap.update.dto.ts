import { Type } from 'class-transformer';
import { IsArray, IsNumber, IsObject, IsString, ValidateNested } from 'class-validator';
import { LocationDto } from './';

export class KeywordDto {
  @IsNumber()
  id: number;

  @IsString()
  keyword: string;

  @IsNumber()
  depth: number;

  @IsObject()
  @ValidateNested()
  @Type(() => LocationDto)
  location: LocationDto;

  @IsArray()
  @IsNumber({}, { each: true })
  children: number[];
}

export class MindmapDto {
  [key: number]: KeywordDto;
}
