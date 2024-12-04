import { PublisherService } from '@app/publisher';
import { Socket } from 'socket.io';
import { Injectable, Logger, UseFilters } from '@nestjs/common';
import { RedisService } from '@liaoliaots/nestjs-redis';
import { Redis } from 'ioredis';
import { InjectRepository } from '@nestjs/typeorm';
import { TreeRepository } from 'typeorm';
import { UpdateMindmapDto, CreateNodeDto } from './dto';
import { Node } from '@app/entity';
import {
  NodeNotFoundException,
  DatabaseException,
  InvalidConnectionIdException,
  JoinRoomException,
  AiRequestException,
  UnauthorizedException,
} from '../../exceptions';
import { WsExceptionFilter } from '../../exceptionfilter/ws.exceptionFilter';

@Injectable()
@UseFilters(WsExceptionFilter)
export class MapService {
  private readonly redis: Redis | null;
  private readonly logger = new Logger(MapService.name);

  constructor(
    private readonly redisService: RedisService,
    private readonly publisherService: PublisherService,
    @InjectRepository(Node) private nodeRepository: TreeRepository<Node>,
  ) {
    this.redis = redisService.getOrThrow('general');
  }

  async createNode(client: Socket, createNodeDto: CreateNodeDto) {
    try {
      const type = await this.redis.hget(client.data.connectionId, 'type');
      const mindmapId = await this.redis.hget(client.data.connectionId, 'mindmapId');
      if (type === 'guest') {
        return { id: createNodeDto.id };
      }

      if (!mindmapId) {
        throw new DatabaseException('유효하지 않은 mindmapId');
      }

      const nodeEntity = this.nodeRepository.create({
        keyword: createNodeDto.keyword,
        depth: createNodeDto.depth,
        locationX: createNodeDto.location.x,
        locationY: createNodeDto.location.y,
        mindmap: { id: Number(mindmapId) },
      });

      if (createNodeDto.parentId) {
        const parentNode = await this.nodeRepository.findOneBy({ id: createNodeDto.parentId });
        if (!parentNode) {
          throw new NodeNotFoundException(createNodeDto.parentId);
        }
        nodeEntity.parent = parentNode;
      }

      const savedNode = await this.nodeRepository.save(nodeEntity);
      return { id: savedNode.id };
    } catch (error) {
      if (error instanceof NodeNotFoundException) throw error;
      throw new DatabaseException(`노드 생성 실패: ${error.message}`);
    }
  }

  async updateNodeList(client: Socket, newState: UpdateMindmapDto) {
    try {
      await this.redis.set(`mindmapState:${client.data.connectionId}`, JSON.stringify(newState));
    } catch {
      throw new DatabaseException('노드 리스트 업데이트 실패');
    }
  }

  async updateContent(client: Socket, content: string) {
    try {
      // this.checkAuth(client);
      await this.redis.set(`content:${client.data.connectionId}`, content);
    } catch (error) {
      if (error instanceof UnauthorizedException) throw error;
      else throw new DatabaseException('회의록 저장 실패');
    }
  }

  async updateTitle(client: Socket, title: string) {
    try {
      // await this.checkAuth(client);
      await this.redis.hset(client.data.connectionId, 'title', title);
    } catch (error) {
      if (error instanceof UnauthorizedException) throw error;
      else throw new DatabaseException('타이틀 저장 실패');
    }
  }

  async textAiRequest(client: Socket, aiContent: string) {
    try {
      const type = await this.redis.hget(client.data.connectionId, 'type');
      if (type === 'guest') {
        throw new UnauthorizedException();
      }
      const aiCount = await this.redis.hget(client.data.connectionId, 'aiCount');
      const mindmapId = await this.redis.hget(client.data.connectionId, 'mindmapId');
      if (Number(aiCount) === 0) {
        throw new AiRequestException('ai 요청 횟수 초과');
      }
      this.publisherService.publish('api-socket', {
        event: 'textAiApi',
        data: { connectionId: client.data.connectionId, aiContent, mindmapId },
      });
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      } else throw new DatabaseException('aiCount 저장 실패');
    }
  }

  async updateAiCount(connectionId: string) {
    try {
      const currentAiCount = await this.redis.hget(connectionId, 'aiCount');
      await this.redis.hset(connectionId, 'aiCount', Number(currentAiCount) - 1);
    } catch {
      throw new DatabaseException('aiCount 업데이트 실패');
    }
  }

  async checkAuth(client: Socket) {
    const type = await this.redis.hget(client.data.connectionId, 'type');
    this.logger.log('연결 type: ' + type + ' 마인드맵');
    if (type === 'guest') {
      return;
    }
    const userId = client.data.user?.id;
    this.logger.log('사용자 id: ' + userId);
    const ownerId = await this.redis.hget(client.data.connectionId, 'ownerId');
    this.logger.log('소유자 id: ' + ownerId);

    if (userId !== ownerId) {
      throw new UnauthorizedException();
    }
  }

  async joinRoom(client: Socket) {
    try {
      const connectionId = this.extractMindmapId(client);
      const type = await this.redis.hget(connectionId, 'type');
      this.logger.log('연결 type: ' + type + ' 마인드맵');

      if (!type) {
        throw new JoinRoomException();
      }

      client.join(connectionId);
      client.data.connectionId = connectionId;
      this.logger.log(`클라이언트 데이터 : ${JSON.stringify(client.data)}`);
      const curruntData: Record<string, any> = {};

      const [currentState, currentContent, currentTitle, currentAiCount, ownerId, mindmapId] = await Promise.all([
        this.redis.get(`mindmapState:${connectionId}`),
        this.redis.get(`content:${connectionId}`),
        this.redis.hget(connectionId, 'title'),
        this.redis.hget(connectionId, 'aiCount'),
        this.redis.hget(connectionId, 'ownerId'),
        this.redis.hget(connectionId, 'mindmapId'),
      ]);

      if (currentState) {
        curruntData['nodeData'] = JSON.parse(currentState);
      }
      if (currentContent) {
        curruntData['content'] = currentContent;
      }
      if (currentTitle) {
        curruntData['title'] = currentTitle;
      }
      if (currentAiCount) {
        curruntData['aiCount'] = currentAiCount;
      }
      if (client.data.user && ownerId !== client.data.user.id) {
        this.publisherService.publish('api-socket', {
          event: 'join',
          data: { connectionId, userId: client.data.user.id, mindmapId },
        });
      }

      return curruntData;
    } catch {
      throw new JoinRoomException();
    }
  }

  async saveData(connectionId: string) {
    try {
      const type = await this.redis.hget(connectionId, 'type');
      if (type === 'guest') {
        this.redis.expire(connectionId, 60 * 60 * 24);
        this.redis.expire(`mindmapState:${connectionId}`, 60 * 60 * 24);
        this.redis.expire(`content:${connectionId}`, 60 * 60 * 24);
        return;
      }

      this.publisherService.publish('api-socket', { event: 'save', data: { connectionId } });
    } catch (error) {
      this.logger.error(error);
      throw new DatabaseException('마인드맵 저장 실패');
    }
  }

  private extractMindmapId(client: Socket) {
    try {
      const connectionId = client.handshake.query.connectionId;
      return Array.isArray(connectionId) ? connectionId.pop() : connectionId;
    } catch {
      throw new InvalidConnectionIdException();
    }
  }

  async setExpireMindmapData(connectionId: string) {
    try {
      await Promise.all([
        this.redis.expire(connectionId, 60 * 60 * 24 * 3),
        this.redis.expire(`mindmapState:${connectionId}`, 60 * 60 * 24 * 3),
        this.redis.expire(`content:${connectionId}`, 60 * 60 * 24 * 3),
      ]);
    } catch (error) {
      this.logger.error('마인드맵 데이터 만료 설정 실패' + error);
      throw new DatabaseException('마인드맵 데이터 만료 설정 실패');
    }
  }
}
