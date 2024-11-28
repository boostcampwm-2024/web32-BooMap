import { Expose } from 'class-transformer';
import { IsEmail, IsString } from 'class-validator';

export class UserInfoDto {
  @Expose()
  @IsEmail()
  email: string;

  @Expose()
  @IsString()
  name: string;
}
