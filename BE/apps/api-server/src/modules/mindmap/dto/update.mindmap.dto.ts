import { IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateMindmapDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsNumber()
  aiCount?: number;

  @IsOptional()
  @IsString()
  content?: string;

  @IsOptional()
  @IsString()
  aiContent?: string;
}
