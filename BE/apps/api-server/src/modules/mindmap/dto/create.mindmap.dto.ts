import { Expose } from 'class-transformer';
import { IsString } from 'class-validator';

export class createMindmapDto {
  @IsString()
  @Expose()
  title: string;

  @Expose()
  aiCount: 5;
}
