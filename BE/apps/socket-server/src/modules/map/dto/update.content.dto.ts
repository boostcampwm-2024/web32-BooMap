import { Expose } from 'class-transformer';
import { IsString } from 'class-validator';

export class UpdateContentDto {
  @Expose()
  @IsString()
  content: string;
}
