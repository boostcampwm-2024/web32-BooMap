import { RedisService } from '@liaoliaots/nestjs-redis';
import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '../user/entities';
import Redis from 'ioredis';

interface accessTokenPayload {
  email: string;
  id: number;
}

interface refreshTokenPayload {
  id: number;
}

@Injectable()
export class AuthService {
  private redis: Redis | null;
  constructor(
    private readonly jwtService: JwtService,
    private readonly redisService: RedisService,
  ) {
    this.redis = this.redisService.getOrThrow();
  }

  generateAccessToken(user: User) {
    const payload: accessTokenPayload = { email: user.email, id: user.id };
    const accessToken = this.jwtService.sign(payload, { expiresIn: 60 * 30 });
    return accessToken;
  }

  generateRefreshToken(user: User) {
    const payload: refreshTokenPayload = { id: user.id };
    const refreshToken = this.jwtService.sign(payload, { expiresIn: '3d' });
    return refreshToken;
  }

  async verifiedRefreshToken(refreshToken: string) {
    const isBlacklisted = await this.redis.get(refreshToken);
    if (isBlacklisted === 'true') {
      throw new BadRequestException('다시 로그인해주세요.');
    }
    const userId = this.jwtService.verify<refreshTokenPayload>(refreshToken).id;
    return userId;
  }

  async logout(refreshToken: string) {
    await this.redis.set(refreshToken, 'true', 'EX', 60 * 60 * 24 * 3);
  }
}
