import { Type } from 'class-transformer';
import { IsNumber, IsString } from 'class-validator';

export class AudioUploadDto {
  @IsNumber()
  @Type(() => Number)
  mindmapId: number;

  @IsString()
  connectionId: string;
}
