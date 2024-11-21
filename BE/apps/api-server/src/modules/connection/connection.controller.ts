import { OptionalJwtGuard } from './../../guards';
import { Controller, Post, UseGuards } from '@nestjs/common';
import { ConnectionService } from './connection.service';
import { User } from '../../decorators';

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
}
