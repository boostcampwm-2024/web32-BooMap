import { IsNumber, IsString } from 'class-validator';

export class AiDto {
  @IsNumber()
  mindmapId: number;

  @IsString()
  connectionId: string;

  @IsString()
  aiContent: string;
}
