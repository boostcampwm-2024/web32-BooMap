import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-github2';

@Injectable()
export class GithubStrategy extends PassportStrategy(Strategy, 'github') {
  constructor(private readonly configService: ConfigService) {
    super({
      clientID: configService.get<string>('GITHUB_CLIENT_ID'),
      clientSecret: configService.get<string>('GITHUB_CLIENT_SECRET'),
      callbackURL: configService.get<string>('GITHUB_CALLBACK_URL'),
      Scope: ['user:email'],
    });
  }

  async validate(accessToken: string, refreshToken: string, profile: any, done) {
    try {
      const { emails } = profile;
      if (!emails || !emails.length) {
        throw new UnauthorizedException('이메일은 필수입니다.');
      }
      const email = emails[0].value;
      return { email };
    } catch (error) {
      return done(error, false);
    }
  }
}
