import { IsArray, IsNumber, IsObject, IsString } from 'class-validator';

export class NodeDto {
  @IsNumber()
  id: number;

  @IsString()
  keyword: string;

  @IsNumber()
  depth: number;

  @IsObject()
  location: { x: number; y: number };

  @IsArray()
  children: number[];
}
