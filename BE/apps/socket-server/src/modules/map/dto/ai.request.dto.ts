import { Expose } from 'class-transformer';
import { IsString } from 'class-validator';

export class AiRequestDto {
  @Expose()
  @IsString()
  aiContent: string;
}
