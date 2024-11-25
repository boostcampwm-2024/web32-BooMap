import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { RedisService } from '@liaoliaots/nestjs-redis';
import { Redis } from 'ioredis';
import { MapService } from './map.service';
import { UseFilters, Injectable } from '@nestjs/common';
import { Socket, Server } from 'socket.io';
import { UpdateMindmapDto, CreateNodeDto } from './dto';
import { MindmapValidationPipe, WsValidationPipe } from '../../pipes';
import { WsExceptionFilter } from '../../exceptionfilter/ws.exceptionFilter';

@Injectable()
@WebSocketGateway({ namespace: 'map' })
@UseFilters(new WsExceptionFilter())
export class MapGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;
  private readonly redis: Redis;

  constructor(
    private readonly mapService: MapService,
    private readonly redisService: RedisService,
  ) {
    this.redis = this.redisService.getOrThrow();
  }

  async handleConnection(@ConnectedSocket() client: Socket) {
    const currentMindMap = await this.mapService.joinRoom(client);
    client.emit('joinRoom', currentMindMap);
  }

  async handleDisconnect(@ConnectedSocket() client: Socket) {
    this.mapService.leaveRoom(client);
  }

  @SubscribeMessage('createNode')
  async handleCreateNode(@ConnectedSocket() client: Socket, @MessageBody(WsValidationPipe) nodeCreateDto: CreateNodeDto) {
    const result = await this.mapService.createNode(client, nodeCreateDto);
    return { event: 'createNode', data: result };
  }

  // @SubscribeMessage('deleteNode')
  // async handleDeleteNode(@ConnectedSocket() client: Socket, @MessageBody(WsValidationPipe) nodeDeleteDto: DeleteNodeDto) {
  //   const result = await this.mapService.deleteNode(client, nodeDeleteDto);
  //   return { event: 'deleteNode', data: result };
  // }

  @SubscribeMessage('updateNode')
  handleMessage(@ConnectedSocket() client: Socket, @MessageBody(MindmapValidationPipe) mindmapDto: UpdateMindmapDto) {
    this.mapService.updateNodeList(client, mindmapDto);
    this.server.to(client.data.connectionId).emit('updateNode', mindmapDto);
  }
}
