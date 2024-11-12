import { Socket } from 'socket.io';
import { Injectable } from '@nestjs/common';
import { RedisService } from '@liaoliaots/nestjs-redis';
import { Redis } from 'ioredis';
import { NodeDto, MindmapDto } from './dto/mindmap.update.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Node } from './entity/node.entity';
import { Repository } from 'typeorm';
import { plainToInstance } from 'class-transformer';
import { NodeCreateDto } from './dto/node.create.dto';

@Injectable()
export class MapService {
  private readonly redis: Redis | null;
  constructor(
    private readonly redisService: RedisService,
    @InjectRepository(Node) private mindmapRepository: Repository<Node>,
  ) {
    this.redis = redisService.getOrThrow();
  }

  updateMindmap(client: Socket, mindmapDto: MindmapDto): void {
    const mindmapDtoList: NodeDto[] = Object.entries(mindmapDto).map(([, value]) => {
      return value;
    });
    mindmapDtoList.map((nodeDto) => {
      this.mindmapRepository.update(nodeDto.id, {
        keyword: nodeDto.keyword,
        locationX: nodeDto.location.x,
        locationY: nodeDto.location.y,
      });
    });
  }

  async createNode(client: Socket, mindmapCreateDto: NodeCreateDto): Promise<void> {
    const nodeEntity = plainToInstance(Node, mindmapCreateDto);
    let parentNode: Node | undefined;

    if (mindmapCreateDto.parentId) {
      parentNode = await this.mindmapRepository.findOneBy({ id: mindmapCreateDto.parentId });
      nodeEntity.parent = parentNode;
    }

    // TODO : 회원, 회의록 외래키 추가 필요
    nodeEntity.locationX = mindmapCreateDto.location.x;
    nodeEntity.locationY = mindmapCreateDto.location.y;
    this.mindmapRepository.save(nodeEntity);
  }

  async deleteNode(client: Socket, nodeId: number): Promise<void> {
    const nodeEntity = await this.mindmapRepository.findOneBy({ id: nodeId });
    await this.mindmapRepository.remove(nodeEntity);
  }
}
