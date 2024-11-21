import { Socket } from 'socket.io';
import { Injectable } from '@nestjs/common';
import { RedisService } from '@liaoliaots/nestjs-redis';
import { plainToInstance } from 'class-transformer';
import { Redis } from 'ioredis';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MindmapDto, NodeCreateDto, nodeDeleteDto, NodeDto } from './dto';
import { Node } from '@app/entity';
import { NodeNotFoundException, DatabaseException, InvalidMindmapIdException } from './exceptions';

@Injectable()
export class MapService {
  private readonly redis: Redis | null;

  constructor(
    private readonly redisService: RedisService,
    @InjectRepository(Node) private nodeRepository: Repository<Node>,
  ) {
    this.redis = redisService.getOrThrow();
  }

  async createNode(client: Socket, nodeCreateDto: NodeCreateDto) {
    const nodeEntity = plainToInstance(Node, nodeCreateDto);

    try {
      if (nodeCreateDto.parentId) {
        const parentNode = await this.nodeRepository.findOneBy({ id: nodeCreateDto.parentId });
        if (!parentNode) {
          throw new NodeNotFoundException(nodeCreateDto.parentId);
        }
        nodeEntity.parent = parentNode;
      }

      nodeEntity.locationX = nodeCreateDto.location.x;
      nodeEntity.locationY = nodeCreateDto.location.y;

      const savedNode = await this.nodeRepository.save(nodeEntity);
      return plainToInstance(NodeDto, savedNode);
    } catch (error) {
      if (error instanceof NodeNotFoundException) throw error;
      throw new DatabaseException('노드 생성 실패');
    }
  }

  async deleteNode(client: Socket, nodeDeleteDto: nodeDeleteDto) {
    await this.nodeRepository.manager.transaction(async (transactionalEntityManager) => {
      for (const nodeId of nodeDeleteDto.id) {
        const nodeEntity = await transactionalEntityManager.findOneBy(Node, { id: nodeId });

        if (!nodeEntity) {
          throw new NodeNotFoundException(nodeId);
        }

        await transactionalEntityManager.softDelete(Node, nodeEntity);
      }
    });
    return nodeDeleteDto.id;
  }

  async updateNodeList(client: Socket, newState: MindmapDto) {
    try {
      await this.redis.set(`mindmapState:${client.data.mindmapId}`, JSON.stringify(newState));
    } catch {
      throw new DatabaseException('노드 리스트 업데이트 실패');
    }
  }

  async joinRoom(client: Socket) {
    const mindmapId = this.extractMindmapId(client);

    const isMindmapIdValid = await this.redis.sismember('mindmapIds', mindmapId as string);
    if (!isMindmapIdValid) {
      throw new InvalidMindmapIdException();
    }

    client.join(mindmapId);
    client.data.mindmapId = mindmapId;

    const currentMindmap = await this.redis.get(`mindmapState:${mindmapId}`);
    if (currentMindmap) {
      return plainToInstance(MindmapDto, JSON.parse(currentMindmap));
    }
  }

  async leaveRoom(client: Socket) {
    try {
      const mindmapId = client.data.mindmapId;
      //TODO user, mindmap 구현 이후 mysql데이터 동기화 로직 추가
      client.leave(mindmapId);
    } catch {
      throw new DatabaseException('마인드맵 저장 실패');
    }
  }

  private extractMindmapId(client: Socket) {
    try {
      const mindmapId = client.handshake.query.mindmapId;
      return Array.isArray(mindmapId) ? mindmapId.pop() : mindmapId;
    } catch {
      throw new InvalidMindmapIdException();
    }
  }
}
