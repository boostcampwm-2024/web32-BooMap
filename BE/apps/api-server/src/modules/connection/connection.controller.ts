import { Controller, Post, Req, UseGuards } from '@nestjs/common';
import { AuthenticatedRequest } from '@app/interface';
import { ConnectionService } from './connection.service';
import { AuthGuard } from '@nestjs/passport';
import { UserService } from '../user/user.service';

@Controller('connection')
export class ConnectionController {
  constructor(
    private readonly connectionService: ConnectionService,
    private readonly userService: UserService,
  ) {}

  @Post()
  @UseGuards(AuthGuard('jwt'))
  async createMindMap(@Req() req: AuthenticatedRequest) {
    const user = await this.userService.findById(req.user.id);
    if (!user) {
      return this.connectionService.createGuestMindmap();
    }
    return this.connectionService.createMindmap(user);
  }
}
