import { JwtService } from '@nestjs/jwt';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { RedisService } from '@liaoliaots/nestjs-redis';
import { Redis } from 'ioredis';
import { MapService } from './map.service';
import { UseFilters, Injectable, Logger } from '@nestjs/common';
import { Socket, Server } from 'socket.io';
import { UpdateMindmapDto, CreateNodeDto, UpdateContentDto, UpdateTitleDto, AiRequestDto } from './dto';
import { MindmapValidationPipe, WsValidationPipe } from '../../pipes';
import { WsExceptionFilter } from '../../exceptionfilter/ws.exceptionFilter';

@Injectable()
@WebSocketGateway({ transports: ['websocket'] })
@UseFilters(new WsExceptionFilter())
export class MapGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;
  private readonly redis: Redis;
  private readonly logger = new Logger(MapGateway.name);

  constructor(
    private readonly mapService: MapService,
    private readonly redisService: RedisService,
    private readonly jwtService: JwtService,
  ) {
    this.redis = this.redisService.getOrThrow('general');
  }

  afterInit() {
    this.logger.log('소켓 서버 초기화 완료');
  }

  async handleConnection(@ConnectedSocket() client: Socket) {
    const refreshToken = client.handshake.headers.cookie?.split('=')[1];

    if (refreshToken) {
      const accessToken = client.handshake.auth.token;
      if (accessToken) {
        try {
          this.jwtService.verify(accessToken);
          const payload = this.jwtService.decode(accessToken);
          const user = { id: payload['id'], email: payload['email'] };
          client.data.user = user;
        } catch {
          try {
            this.jwtService.verify(refreshToken);
            const payload = this.jwtService.decode(refreshToken);
            const user = { id: payload['id'], email: payload['email'] };
            const accessToken = this.jwtService.sign(user, { expiresIn: '30m' });
            client.emit('tokenRefresh', { accessToken });
            client.data.user = user;
          } catch {
            client.emit('tokenExpiredError', { message: '리프레시 토큰 만료' });
          }
        }
      }
    } else {
      client.data.user = null;
    }
    this.logger.log(
      '사용자 연결 : ' + (client.data.user ? `유저 ID : ${client.data.user.id}` : `guest ID : ${client.id}`),
    );
    const currentData = await this.mapService.joinRoom(client);
    client.emit('joinRoom', currentData);
  }

  async handleDisconnect(@ConnectedSocket() client: Socket) {
    this.logger.log('사용자 연결 종료 : ' + (client.data.user ? client.data.user.id : `guest ${client.id}`));
    const connectionId = client.data.connectionId;
    const roomSize = this.server.sockets.adapter.rooms.get(connectionId)?.size;
    this.logger.log(`${connectionId} 방 남은 인원 수 : ${roomSize}`);
    client.leave(connectionId);
    if (!roomSize) {
      await this.mapService.saveData(connectionId);
    }
  }

  @SubscribeMessage('createNode')
  async handleCreateNode(
    @ConnectedSocket() client: Socket,
    @MessageBody(WsValidationPipe) nodeCreateDto: CreateNodeDto,
  ) {
    this.logger.log('createNode 이벤트 : ' + (client.data.user ? client.data.user.id : `guest ${client.id}`));
    const result = await this.mapService.createNode(client, nodeCreateDto);
    return { event: 'createNode', data: result };
  }

  @SubscribeMessage('updateNode')
  handleUpdateNode(
    @ConnectedSocket() client: Socket,
    @MessageBody(MindmapValidationPipe) mindmapDto: UpdateMindmapDto,
  ) {
    this.logger.log('updateNode 이벤트 : ' + +(client.data.user ? client.data.user.id : `guest ${client.id}`));
    this.mapService.updateNodeList(client, mindmapDto);
    this.server.to(client.data.connectionId).emit('updateNode', mindmapDto);
  }

  @SubscribeMessage('updateContent')
  handleUpdateContent(
    @ConnectedSocket() client: Socket,
    @MessageBody(WsValidationPipe) updateContentDto: UpdateContentDto,
  ) {
    this.logger.log('updateContent 이벤트 : ' + (client.data.user ? client.data.user.id : `guest ${client.id}`));
    this.mapService.updateContent(client, updateContentDto.content);
    this.server.to(client.data.connectionId).emit('updateContent', updateContentDto);
  }

  @SubscribeMessage('updateTitle')
  handleUpdateTitle(@ConnectedSocket() client: Socket, @MessageBody(WsValidationPipe) updateTitleDto: UpdateTitleDto) {
    this.logger.log('updateTitle 이벤트 : ' + (client.data.user ? client.data.user.id : `guest ${client.id}`));
    this.mapService.updateTitle(client, updateTitleDto.title);
    this.server.to(client.data.connectionId).emit('updateTitle', updateTitleDto);
  }

  @SubscribeMessage('aiRequest')
  async handleAiRequest(@ConnectedSocket() client: Socket, @MessageBody(WsValidationPipe) aiRequestDto: AiRequestDto) {
    this.logger.log('aiRequest 이벤트 : ' + (client.data.user ? client.data.user.id : `guest ${client.id}`));
    this.server.to(client.data.connectionId).emit('aiPending', { status: true });
    const result = await this.mapService.aiRequest(client, aiRequestDto.aiContent);
    client.emit('aiResponse', result);
    this.server.to(client.data.connectionId).emit('aiPending', { status: false });
  }
}
