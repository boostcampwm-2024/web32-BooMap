import { RedisService } from '@liaoliaots/nestjs-redis';
import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '@app/entity';
import Redis from 'ioredis';

interface tokenPayload {
  email: string;
  id: number;
}

@Injectable()
export class AuthService {
  private GeneralRedis: Redis | null;
  private readonly logger = new Logger(AuthService.name);
  constructor(
    private readonly jwtService: JwtService,
    private readonly redisService: RedisService,
  ) {
    this.GeneralRedis = this.redisService.getOrThrow('general');
  }

  generateAccessToken(user: User) {
    const payload = { email: user.email, id: user.id };
    const accessToken = this.jwtService.sign(payload, { expiresIn: 60 * 30 });
    return accessToken;
  }

  generateRefreshToken(user: User) {
    const payload = { id: user.id, email: user.email };
    const refreshToken = this.jwtService.sign(payload, { expiresIn: '3d' });
    return refreshToken;
  }

  async verifiedRefreshToken(refreshToken: string) {
    const isBlacklisted = await this.GeneralRedis.get(refreshToken);
    if (isBlacklisted === 'true') {
      throw new UnauthorizedException('다시 로그인해주세요.');
    }
    this.jwtService.verify(refreshToken);
    const decoded = this.jwtService.decode(refreshToken);
    if (!decoded || typeof decoded !== 'object') {
      throw new UnauthorizedException('Invalid token format');
    }

    const payload: tokenPayload = {
      email: decoded.email,
      id: decoded.id,
    };

    const accessToken = this.jwtService.sign(payload, { expiresIn: 60 * 30 });
    return accessToken;
  }

  async logout(refreshToken: string) {
    try {
      await this.GeneralRedis.set(refreshToken, 'true', 'EX', 60 * 60 * 24 * 3);
    } catch (error) {
      this.logger.error(error);
      throw new UnauthorizedException('로그아웃에 실패했습니다.');
    }
  }
}
