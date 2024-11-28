import { RedisService } from '@liaoliaots/nestjs-redis';
import { BadRequestException, Injectable, Logger } from '@nestjs/common';
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
      throw new BadRequestException('다시 로그인해주세요.');
    }

    try {
      this.jwtService.verify(refreshToken);
      const decoded = this.jwtService.decode(refreshToken);
      if (!decoded || typeof decoded !== 'object') {
        throw new BadRequestException('Invalid token format');
      }

      const payload: tokenPayload = {
        email: decoded.email,
        id: decoded.id,
      };

      const accessToken = this.jwtService.sign(payload, { expiresIn: 60 * 30 });
      return accessToken;
    } catch (error) {
      this.logger.error(error);
      throw new BadRequestException('다시 로그인해  주세요.');
    }
  }

  async logout(refreshToken: string) {
    await this.GeneralRedis.set(refreshToken, 'true', 'EX', 60 * 60 * 24 * 3);
  }
}
