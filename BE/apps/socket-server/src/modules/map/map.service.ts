import { PublisherService } from './../pubsub/publisher.service';
import { Socket } from 'socket.io';
import { Injectable, Logger } from '@nestjs/common';
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

@Injectable()
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

      // mindmapId가 유효한지 확인
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
      this.checkAuth(client);
      await this.redis.set(`content:${client.data.connectionId}`, content);
    } catch (error) {
      if (error instanceof UnauthorizedException) throw error;
      else throw new DatabaseException('회의록 저장 실패');
    }
  }

  async updateTitle(client: Socket, title: string) {
    try {
      await this.checkAuth(client);
      await this.redis.hset(client.data.connectionId, 'title', title);
    } catch (error) {
      if (error instanceof UnauthorizedException) throw error;
      else throw new DatabaseException('타이틀 저장 실패');
    }
  }

  async aiRequest(client: Socket, aiContent: string) {
    try {
      await this.checkAuth(client);
      const aiCount = await this.redis.hget(client.data.connectionId, 'aiCount');
      if (Number(aiCount) === 0) {
        throw new AiRequestException('ai 요청 횟수 초과');
      }
      this.publisherService.publish(
        'api-socket',
        JSON.stringify({ event: 'aiText', data: { connectionId: client.data.connectionId, aiContent } }),
      );
      await this.redis.hset(client.data.connectionId, 'aiCount', Number(aiCount) - 1);
    } catch (error) {
      if (error instanceof UnauthorizedException) throw error;
      else throw new DatabaseException('aiCount 저장 실패');
    }
  }

  async checkAuth(client: Socket) {
    const userId = client.data.user.id;
    const ownerId = await this.redis.hget(client.data.connectionId, 'ownerId');

    if (userId !== ownerId) {
      throw new UnauthorizedException();
    }
  }

  async joinRoom(client: Socket) {
    const connectionId = this.extractMindmapId(client);

    try {
      const type = await this.redis.hget(connectionId, 'type');
      this.logger.log('연결 type: ' + type + ' 마인드맵');
      if (!type) {
        throw new InvalidConnectionIdException();
      }

      client.join(connectionId);
      client.data.connectionId = connectionId;
      const curruntData: Record<string, any> = {};

      const [currentState, currentContent, currentTitle, currentAiCount, mindmapId] = await Promise.all([
        this.redis.get(`mindmapState:${connectionId}`),
        this.redis.get(`content:${connectionId}`),
        this.redis.hget(connectionId, 'title'),
        this.redis.hget(connectionId, 'aiCount'),
        this.redis.hget(connectionId, 'owner'),
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
      if (client.data.user) {
        this.publisherService.publish(
          'api-socket',
          JSON.stringify({ event: 'join', data: { connectionId, userId: client.data.user, mindmapId } }),
        );
      }

      return curruntData;
    } catch (error) {
      Logger.error(error);
      throw new JoinRoomException();
    }
  }

  async saveData(connectionId: string) {
    try {
      const type = await this.redis.hget(connectionId, 'type');
      if (type === 'guest') {
        return;
      }

      this.publisherService.publish('api-socket', JSON.stringify({ event: 'save', data: { connectionId } }));
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
}
