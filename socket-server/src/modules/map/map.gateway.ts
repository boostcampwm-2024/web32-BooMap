import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { RedisService } from '@liaoliaots/nestjs-redis';
import { Redis } from 'ioredis';
import { MapService } from './map.service';
import { UseFilters, UsePipes, Injectable } from '@nestjs/common';
import { WsExceptionFilter } from 'src/exceptionfilter/ws.exceptionFilter';

import { MindmapDto, NodeCreateDto } from './dto';
import { WsValidationPipe } from 'src/pipes/ws.validation.pipe';
import { MindmapValidationPipe } from 'src/pipes/mindmap.validation.pipe';
import { nodeDeleteDto } from './dto/node.delete.dto';

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

  @UsePipes(WsValidationPipe)
  async handleConnection(@ConnectedSocket() client: Socket) {
    const currentMindMap = this.mapService.joinRoom(client);
    return { event: 'joinRoom', data: currentMindMap };
  }
  @UsePipes(WsValidationPipe)
  async handleDisconnect(@ConnectedSocket() client: Socket) {
    this.mapService.leaveRoom(client);
  }

  @SubscribeMessage('createNode')
  async handleCreateNode(@ConnectedSocket() client: Socket, @MessageBody(WsValidationPipe) nodeCreateDto: NodeCreateDto) {
    const result = await this.mapService.createNode(client, nodeCreateDto);
    return { event: 'createNode', data: result };
  }

  @SubscribeMessage('deleteNode')
  async handleDeleteNode(@ConnectedSocket() client: Socket, @MessageBody(WsValidationPipe) nodeDeleteDto: nodeDeleteDto) {
    const result = await this.mapService.deleteNode(client, nodeDeleteDto);
    return { event: 'deleteNode', data: result };
  }

  @SubscribeMessage('updateNode')
  handleMessage(@ConnectedSocket() client: Socket, @MessageBody(MindmapValidationPipe) mindmapDto: MindmapDto) {
    this.mapService.updateNodeList(client, mindmapDto);
    this.server.to(client.data.mindmapId).emit('updateNode', mindmapDto);
  }
}
