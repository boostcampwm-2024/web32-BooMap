import { IsEmail, IsNumber, IsString } from 'class-validator';

export class UserInfoDto {
  @IsNumber()
  id: number;
  @IsEmail()
  email: string;
  @IsString()
  type: string;
}
