import { Socket } from 'socket.io';
import { Injectable, Logger } from '@nestjs/common';
import { RedisService } from '@liaoliaots/nestjs-redis';
import { plainToInstance } from 'class-transformer';
import { Redis } from 'ioredis';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UpdateMindmapDto, CreateNodeDto } from './dto';
import { Node } from '@app/entity';
import {
  NodeNotFoundException,
  DatabaseException,
  InvalidConnectionIdException,
  JoinRoomException,
} from './exceptions';

@Injectable()
export class MapService {
  private readonly redis: Redis | null;

  constructor(
    private readonly redisService: RedisService,
    @InjectRepository(Node) private nodeRepository: Repository<Node>,
  ) {
    this.redis = redisService.getOrThrow();
  }

  async createNode(client: Socket, createNodeDto: CreateNodeDto) {
    const nodeEntity = plainToInstance(Node, createNodeDto);
    // 회원, 비회원 구분 로직 추가
    try {
      if (createNodeDto.parentId) {
        const parentNode = await this.nodeRepository.findOneBy({ id: createNodeDto.parentId });
        if (!parentNode) {
          throw new NodeNotFoundException(createNodeDto.parentId);
        }
        nodeEntity.parent = parentNode;
      }

      nodeEntity.locationX = createNodeDto.location.x;
      nodeEntity.locationY = createNodeDto.location.y;

      const savedNode = await this.nodeRepository.save(nodeEntity);
      return { id: savedNode.id };
    } catch (error) {
      if (error instanceof NodeNotFoundException) throw error;
      throw new DatabaseException('노드 생성 실패');
    }
  }

  async updateNodeList(client: Socket, newState: UpdateMindmapDto) {
    try {
      await this.redis.set(`mindmapState:${client.data.connectionId}`, JSON.stringify(newState));
    } catch {
      throw new DatabaseException('노드 리스트 업데이트 실패');
    }
  }

  async joinRoom(client: Socket) {
    const connectionId = this.extractMindmapId(client);

    try {
      const type = await this.redis.hget(connectionId, 'type');

      if (!type) {
        throw new InvalidConnectionIdException();
      }

      client.join(connectionId);
      client.data.connectionId = connectionId;

      const curruntData: Record<string, any> = {};

      const [currentState, currentContent, currentTitle, currentAiCount] = await Promise.all([
        this.redis.get(`mindmapState:${connectionId}`),
        this.redis.get(`content:${connectionId}`),
        this.redis.hget(connectionId, 'title'),
        this.redis.hget(connectionId, 'aiCount'),
        this.redis.hget(connectionId, 'owner'),
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

      return curruntData;
    } catch (error) {
      Logger.error(error);
      throw new JoinRoomException();
    }
  }

  async leaveRoom(client: Socket) {
    try {
      const connectionId = client.data.connectionId;
      //TODO user, mindmap 구현 이후 mysql데이터 동기화 로직 추가
      client.leave(connectionId);
    } catch {
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
