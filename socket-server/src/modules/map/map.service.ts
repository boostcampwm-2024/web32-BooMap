import { Socket } from 'socket.io';
import { Injectable } from '@nestjs/common';
import { RedisService } from '@liaoliaots/nestjs-redis';
import { plainToInstance } from 'class-transformer';
import { Redis } from 'ioredis';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { MindmapDto, NodeCreateDto, NodeDto } from './dto';
import { Node } from './entity/node.entity';

@Injectable()
export class MapService {
  private readonly redis: Redis | null;

  constructor(
    private readonly redisService: RedisService,
    @InjectRepository(Node) private nodeRepository: Repository<Node>,
  ) {
    this.redis = redisService.getOrThrow();
  }

  updateMindmap(client: Socket, mindmapDto: MindmapDto): void {
    const updateNodeList = Object.entries(mindmapDto).map(([, value]) => value as NodeDto);

    this.nodeRepository.manager.transaction(async (manager: EntityManager) => {
      for (const nodeDto of updateNodeList) {
        await manager.update(Node, nodeDto.id, {
          keyword: nodeDto.keyword,
          depth: nodeDto.depth,
          locationX: nodeDto.location.x,
          locationY: nodeDto.location.y,
        });
      }
    });
  }

  async createNode(client: Socket, mindmapCreateDto: NodeCreateDto): Promise<void> {
    const nodeEntity = plainToInstance(Node, mindmapCreateDto);
    let parentNode: Node | undefined;

    if (mindmapCreateDto.parentId) {
      parentNode = await this.nodeRepository.findOneBy({ id: mindmapCreateDto.parentId });
      nodeEntity.parent = parentNode;
    }

    // TODO : 회원, 회의록 외래키 추가 필요
    nodeEntity.locationX = mindmapCreateDto.location.x;
    nodeEntity.locationY = mindmapCreateDto.location.y;
    const savedNode = await this.nodeRepository.save(nodeEntity);

    client.emit('nodeCreated', savedNode.id);
  }

  async deleteNode(client: Socket, nodeId: number): Promise<void> {
    const nodeEntity = await this.nodeRepository.findOneBy({ id: nodeId });
    await this.nodeRepository.remove(nodeEntity);
  }
}
