import { Expose } from 'class-transformer';
import { IsString } from 'class-validator';

export class UserCreateDto {
  @Expose()
  @IsString()
  email: string;

  @Expose()
  @IsString()
  name: string;
}
