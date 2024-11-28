import { Injectable, NestMiddleware, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class TokenRefreshMiddleware implements NestMiddleware {
  constructor(private readonly jwtService: JwtService) {}

  use(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers.authorization;
    const refreshToken = req.cookies['refreshToken'];

    // 토큰이 전혀 없는 경우 통과
    if (!authHeader && !refreshToken) {
      return next();
    }

    // access token이 있는 경우 검증
    if (authHeader) {
      const accessToken = authHeader.split(' ')[1];
      try {
        this.jwtService.verify(accessToken);
        return next();
      } catch {
        // access token이 만료되었고 refresh token이 있는 경우
        if (refreshToken) {
          this.validateAndRefreshToken(refreshToken, req);
        }
      }
    }

    // access token이 없고 refresh token만 있는 경우
    if (!authHeader && refreshToken) {
      this.validateAndRefreshToken(refreshToken, req);
    }

    next();
  }

  private validateAndRefreshToken(refreshToken: string, req: Request): void {
    try {
      this.jwtService.verify(refreshToken);
      const decoded = this.jwtService.decode(refreshToken);
      const payload = { email: decoded['email'], id: decoded['id'] };
      const newAccessToken = this.jwtService.sign(payload, { expiresIn: '30m' });
      req.headers.authorization = `Bearer ${newAccessToken}`;
    } catch {
      req.cookies['refreshToken'] = '';
      throw new UnauthorizedException('Refresh token is expired or invalid');
    }
  }
}
