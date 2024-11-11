import { Socket } from 'socket.io';
import { Injectable } from '@nestjs/common';
import { RedisService } from '@liaoliaots/nestjs-redis';
import { Redis } from 'ioredis';
import { KeywordDto, MindmapDto } from './dto/mindmap.update.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Keyword } from './entity/keyword.entity';
import { Repository } from 'typeorm';
import { plainToInstance } from 'class-transformer';
import { MindmapCreateDto } from './dto/mindmap.create.dto';

@Injectable()
export class MapService {
  private readonly redis: Redis | null;
  constructor(
    private readonly redisService: RedisService,
    @InjectRepository(Keyword) private mindmapRepository: Repository<Keyword>,
  ) {
    this.redis = redisService.getOrThrow();
  }

  updateMindmap(client: Socket, mindmapDto: MindmapDto): void {
    const mindmapDtoList: KeywordDto[] = Object.entries(mindmapDto).map(([, value]) => {
      return value;
    });
    mindmapDtoList.map((keywordDto) => {
      this.mindmapRepository.update(keywordDto.id, {
        keyword: keywordDto.keyword,
        locationX: keywordDto.location.x,
        locationY: keywordDto.location.y,
      });
    });
  }

  async createNode(client: Socket, mindmapCreateDto: MindmapCreateDto): Promise<void> {
    const keywordEntity = plainToInstance(Keyword, mindmapCreateDto);
    let parentKeyword: Keyword | undefined;

    if (mindmapCreateDto.parentId) {
      parentKeyword = await this.mindmapRepository.findOneBy({ id: mindmapCreateDto.parentId });
      keywordEntity.parent = parentKeyword;
    }

    // TODO : 회원, 회의록 외래키 추가 필요
    keywordEntity.locationX = mindmapCreateDto.location.x;
    keywordEntity.locationY = mindmapCreateDto.location.y;
    this.mindmapRepository.save(keywordEntity);
  }

  async deleteNode(client: Socket, nodeId: number): Promise<void> {
    const keywordEntity = await this.mindmapRepository.findOneBy({ id: nodeId });
    await this.mindmapRepository.remove(keywordEntity);
  }
}
