import * as cookieParser from 'cookie-parser';
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { JsonWebTokenError, JwtService, TokenExpiredError } from '@nestjs/jwt';
import { InvalidTokenException } from '../exceptions';
import { Socket } from 'socket.io';

@Injectable()
export class WsOptionalJwtGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  canActivate(context: ExecutionContext): boolean {
    const client = context.switchToWs().getClient<Socket>();
    const token = client.handshake.headers.authorization?.split(' ')[1];

    if (!token) {
      return true;
    }

    try {
      const user = this.jwtService.verify(token);
      client.data.user = user;
      return true;
    } catch (error) {
      if (error instanceof JsonWebTokenError) {
        throw new InvalidTokenException();
      } else if (error instanceof TokenExpiredError) {
        try {
          const refreshToken = cookieParser.JSONCookie(client.handshake.headers.cookie)['refreshToken'];
          const payload = this.jwtService.verify(refreshToken);
          const accessToken = this.jwtService.sign(payload, { expiresIn: '30m' });
          client.emit('tokenRefresh', { accessToken });
          client.data.user = payload;
          return true;
        } catch {
          client.emit('tokenExpiredError', { message: '리프레시 토큰 만료' });
          return false;
        }
      }
    }
  }
}
