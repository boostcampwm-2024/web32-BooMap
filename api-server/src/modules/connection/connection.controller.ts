import { Controller, Post } from '@nestjs/common';
import { ConnectionService } from './connection.service';

@Controller('connection')
export class ConnectionController {
  constructor(private readonly connectionService: ConnectionService) {}

  @Post()
  createMindMap(): Promise<string> {
    return this.connectionService.createMindmap();
  }
}
