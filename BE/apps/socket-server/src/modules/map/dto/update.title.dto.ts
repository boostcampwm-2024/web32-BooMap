import { Expose } from 'class-transformer';
import { IsString } from 'class-validator';

export class UpdateTitleDto {
  @Expose()
  @IsString()
  title: string;
}
