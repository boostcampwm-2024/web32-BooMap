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

// error: Cannot read properties of undefined (reading 'map') {"context":"ConnectionService","error":{},"stack":[
// "TypeError: Cannot read properties of undefined (reading 'map')\n
//     at /app/dist/main.js:1020:37\n    at Array.map (<anonymous>)\n
//         at NodeService.tableToCanvas (/app/dist/main.js:1015:40)\n
//             at process.processTicksAndRejections (node:internal/process/task_queues:105:5)\n
//                 at async MindmapService.getDataByMindmapId (/app/dist/main.js:922:23)\n
//                     at async ConnectionService.setConnection (/app/dist/main.js:782:33)\n
//                        at async ConnectionController.setConnection (/app/dist/main.js:601:16)\n
//                            at async /app/node_modules/@nestjs/core/router/router-execution-context.js:46:28\n
//                                at async /app/node_modules/@nestjs/core/router/router-proxy.js:9:17"]}
