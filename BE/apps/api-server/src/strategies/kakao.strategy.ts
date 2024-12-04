import { ConfigService } from '@nestjs/config';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-kakao';

@Injectable()
export class KakaoStrategy extends PassportStrategy(Strategy, 'kakao') {
  constructor(private readonly configService: ConfigService) {
    super({
      clientID: configService.get<string>('KAKAO_CLIENT_ID'),
      clientSecret: configService.get<string>('KAKAO_SECRET'),
      callbackURL: configService.get<string>('KAKAO_CALLBACK_URL'),
    });
  }

  async validate(accessToken: string, refreshToken: string, profile: any, done) {
    try {
      const { _json } = profile;
      const email = _json && _json.kakao_account.email;
      if (!email) {
        throw new UnauthorizedException('이메일은 필수입니다.');
      }
      const name = _json && _json.properties.nickname;
      return { name, email };
    } catch (error) {
      return done(error, false);
    }
  }
}
