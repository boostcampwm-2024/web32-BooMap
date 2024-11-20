import { AuthService } from './../auth/auth.service';
import { Controller, Post, Req } from '@nestjs/common';
import { AuthenticatedRequest } from '../../interface';
import { ConnectionService } from './connection.service';

import { UserService } from '../user/user.service';

@Controller('connection')
export class ConnectionController {
  constructor(
    private readonly connectionService: ConnectionService,
    private readonly userService: UserService,
    private readonly authService: AuthService,
  ) {}

  @Post()
  async createMindMap(@Req() req: AuthenticatedRequest) {
    return this.connectionService.createGuestMindmap();
    // if (!user) {
    // }
    // return this.connectionService.createMindmap(user);
  }

  @Post('guest')
  async createGuestMindMap() {
    return this.connectionService.createGuestMindmap();
  }
}
