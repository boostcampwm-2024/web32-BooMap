import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PassportModule } from '@nestjs/passport';
import { KakaoStrategy, GithubStrategy } from '../../strategies';
import { UserModule } from '../user/user.module';
import { JwtStrategy } from '@app/jwt';

@Module({
  imports: [PassportModule, UserModule],
  controllers: [AuthController],
  providers: [AuthService, GithubStrategy, KakaoStrategy, JwtStrategy],
})
export class AuthModule {}
