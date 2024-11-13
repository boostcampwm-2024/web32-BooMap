import { Socket } from 'socket.io';
import { Injectable } from '@nestjs/common';
import { RedisService } from '@liaoliaots/nestjs-redis';
import { plainToInstance } from 'class-transformer';
import { Redis } from 'ioredis';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { MindmapDto, NodeCreateDto, NodeDto } from './dto';
import { Node } from './entity/node.entity';
import { NodeNotFoundException, DatabaseError } from './exceptions';

@Injectable()
export class MapService {
  private readonly redis: Redis | null;

  constructor(
    private readonly redisService: RedisService,
    @InjectRepository(Node) private nodeRepository: Repository<Node>,
  ) {
    this.redis = redisService.getOrThrow();
  }

  async updateMindmap(client: Socket, mindmapDto: MindmapDto): Promise<void> {
    const updateNodeList = Object.entries(mindmapDto).map(([, value]) => value as NodeDto);

    try {
      await this.nodeRepository.manager.transaction(async (manager: EntityManager) => {
        for (const nodeDto of updateNodeList) {
          const node = await manager.findOne(Node, { where: { id: nodeDto.id } });
          if (!node) {
            throw new NodeNotFoundException();
          }

          await manager.update(Node, nodeDto.id, {
            keyword: nodeDto.keyword,
            depth: nodeDto.depth,
            locationX: nodeDto.location.x,
            locationY: nodeDto.location.y,
          });
        }
      });
    } catch (error) {
      if (error instanceof NodeNotFoundException) {
        throw error;
      }
      throw new DatabaseError('마인드맵 업데이트 실패');
    }
  }

  async createNode(client: Socket, mindmapCreateDto: NodeCreateDto): Promise<void> {
    const nodeEntity = plainToInstance(Node, mindmapCreateDto);
    let parentNode: Node | undefined;

    if (mindmapCreateDto.parentId) {
      parentNode = await this.nodeRepository.findOneBy({ id: mindmapCreateDto.parentId });
      if (!parentNode) {
        throw new NodeNotFoundException();
      }
      nodeEntity.parent = parentNode;
    }

    // TODO : 회원, 회의록 외래키 추가 필요
    nodeEntity.locationX = mindmapCreateDto.location.x;
    nodeEntity.locationY = mindmapCreateDto.location.y;

    try {
      const savedNode = await this.nodeRepository.save(nodeEntity);
      client.emit('nodeCreated', savedNode.id);
    } catch {
      throw new DatabaseError('노드 생성 실패');
    }
  }

  async deleteNode(client: Socket, nodeId: number): Promise<void> {
    const nodeEntity = await this.nodeRepository.findOneBy({ id: nodeId });

    if (!nodeEntity) {
      throw new NodeNotFoundException();
    }

    try {
      await this.nodeRepository.remove(nodeEntity);
    } catch {
      throw new DatabaseError('노드 삭제 실패');
    }
  }
}
