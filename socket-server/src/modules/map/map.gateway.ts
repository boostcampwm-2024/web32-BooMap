import { MapService } from './map.service';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { MindmapDto } from './dto/mindmap.update.dto';
import { RedisService } from '@liaoliaots/nestjs-redis';
import { Redis } from 'ioredis';
import { NodeCreateDto } from './dto/node.create.dto';

@WebSocketGateway({ namespace: 'map' })
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
    const isMindmapIdValid = await this.redis.sismember('mindmapIds', mindmapId as string);
    if (isMindmapIdValid) {
      client.join(mindmapId);
      client.data.mindmapId = mindmapId;
    } else {
      client.disconnect();
    }
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
}
