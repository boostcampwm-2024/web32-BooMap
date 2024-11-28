import { OptionalJwtGuard } from '@app/jwt';
import { Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ConnectionService } from './connection.service';
import { User } from '../../decorators';
import { AuthGuard } from '@nestjs/passport';

@Controller('connection')
export class ConnectionController {
  constructor(private readonly connectionService: ConnectionService) {}

  @Post()
  @UseGuards(OptionalJwtGuard)
  async createMindMap(@User() user) {
    if (!user) {
      return await this.connectionService.createGuestConnection();
    }
    return await this.connectionService.createConnection(user.id);
  }

  @Get(':mindmapId')
  @UseGuards(AuthGuard('jwt'))
  async setConnection(@User() user, @Param('mindmapId') mindmapId: number) {
    return await this.connectionService.setConnection(mindmapId, user.id);
  }
}
