import { Expose } from 'class-transformer';
import { IsEmail, IsNumber, IsString } from 'class-validator';

export class UserInfoDto {
  @Expose()
  @IsNumber()
  id: number;

  @Expose()
  @IsEmail()
  email: string;

  @Expose()
  @IsString()
  type: string;
}
