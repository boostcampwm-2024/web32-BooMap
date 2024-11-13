import { Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { Redis } from 'ioredis';
import { RedisService } from '@liaoliaots/nestjs-redis';

@Injectable()
export class ConnectionService {
  private readonly redis: Redis | null;

  constructor(private readonly redisService: RedisService) {
    this.redis = this.redisService.getOrThrow();
  }

  async createMindmapId(): Promise<string> {
    const uuid = uuidv4();
    //TODO roomID 만료시간 설정 - 개별 roomID에 대해 만료시간 설정, socket서버에서 데이터 통신시 만료시간 갱신, 만료시간이 지난 roomID는 삭제
    await this.redis.sadd('mindmapIds', uuid);
    return uuid;
  }
}
