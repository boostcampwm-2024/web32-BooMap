import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { RedisService } from '@liaoliaots/nestjs-redis';
import { Redis } from 'ioredis';
import { MapService } from './map.service';
import { UseFilters } from '@nestjs/common';
import { WsExceptionFilter } from 'src/exceptionfilter/ws.exceptionFilter';
import { InvalidMindmapIdException } from './exceptions';

import { MindmapDto, NodeCreateDto } from './dto';

@WebSocketGateway({ namespace: 'map' })
@UseFilters(new WsExceptionFilter())
export class MapGateway implements OnGatewayConnection {
  @WebSocketServer()
  server: Server;
  private readonly redis: Redis | null;

  constructor(
    private readonly mapService: MapService,
    redisService: RedisService,
  ) {
    this.redis = redisService.getOrThrow();
  }

  async handleConnection(@ConnectedSocket() client: Socket): Promise<void> {
    const { mindmapId } = client.handshake.query;

    if (!mindmapId) {
      throw new InvalidMindmapIdException();
    }

    const isMindmapIdValid = await this.redis.sismember('mindmapIds', mindmapId as string);
    if (!isMindmapIdValid) {
      throw new InvalidMindmapIdException();
    }

    client.join(mindmapId);
    client.data.mindmapId = mindmapId;
  }

  @SubscribeMessage('updateNode')
  handleMessage(@ConnectedSocket() client: Socket, @MessageBody() data: string): void {
    const mindmapUpdateDto = JSON.parse(data) as MindmapDto;
    this.mapService.updateMindmap(client, mindmapUpdateDto);
  }

  @SubscribeMessage('createNode')
  handleCreateNode(@ConnectedSocket() client: Socket, @MessageBody() data: string): void {
    const nodeCreateDto = JSON.parse(data) as NodeCreateDto;
    this.mapService.createNode(client, nodeCreateDto);
  }

  @SubscribeMessage('deleteNode')
  handleDeleteNode(@ConnectedSocket() client: Socket, @MessageBody() data: string): void {
    const nodeId = parseInt(data, 10);
    this.mapService.deleteNode(client, nodeId);
  }
}
