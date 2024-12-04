import { OptionalJwtGuard } from '@app/jwt';
import { BadRequestException, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { ConnectionService } from './connection.service';
import { User } from '../../decorators';
import { AuthGuard } from '@nestjs/passport';
import { ConnectionQueryDto } from './dto/connection.query.dto';

interface UserDto {
  id: number;
  email: string;
}

@Controller('connection')
export class ConnectionController {
  constructor(private readonly connectionService: ConnectionService) {}

  @Post()
  @UseGuards(OptionalJwtGuard)
  async createMindMap(@User() user: UserDto | null) {
    return user
      ? await this.connectionService.createConnection(user.id)
      : await this.connectionService.createGuestConnection();
  }

  @Get()
  @UseGuards(AuthGuard('jwt'))
  async getConnection(@Query() queryDto: ConnectionQueryDto, @User() user: UserDto) {
    const { type, id } = queryDto;
    console.log('type:', type);
    console.log('id:', id);
    switch (type) {
      case 'connection':
        return await this.connectionService.getConnection(id as string, user.id);
      case 'mindmap':
        return await this.connectionService.setConnection(id as number, user.id);
      default:
        throw new BadRequestException('Invalid query type');
    }
  }
}
