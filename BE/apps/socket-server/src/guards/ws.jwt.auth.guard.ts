import * as cookieParser from 'cookie-parser';
import { CanActivate, ExecutionContext, Injectable, Logger } from '@nestjs/common';
import { JsonWebTokenError, JwtService, TokenExpiredError } from '@nestjs/jwt';
import { InvalidTokenException } from '../exceptions';
import { Socket } from 'socket.io';

@Injectable()
export class WsOptionalJwtGuard implements CanActivate {
  private readonly logger = new Logger(WsOptionalJwtGuard.name);
  constructor(private readonly jwtService: JwtService) {}

  canActivate(context: ExecutionContext): boolean {
    const client = context.switchToWs().getClient<Socket>();
    const token = client.handshake.auth.token;
    this.logger.log('토큰 : ' + token);

    if (!token) {
      return true;
    }

    try {
      this.jwtService.verify(token);
      const payload = this.jwtService.decode(token);
      const user = { id: payload['id'], email: payload['email'] };
      client.data.user = user;
      return true;
    } catch (error) {
      if (error instanceof JsonWebTokenError) {
        throw new InvalidTokenException();
      } else if (error instanceof TokenExpiredError) {
        try {
          const refreshToken = cookieParser.JSONCookie(client.handshake.headers.cookie)['refreshToken'];
          this.jwtService.verify(refreshToken);
          const payload = this.jwtService.decode(refreshToken);
          const user = { id: payload['id'], email: payload['email'] };
          const accessToken = this.jwtService.sign(user, { expiresIn: '30m' });
          client.emit('tokenRefresh', { accessToken });
          client.data.user = user;
          return true;
        } catch {
          client.emit('tokenExpiredError', { message: '리프레시 토큰 만료' });
          return false;
        }
      }
    }
  }
}
