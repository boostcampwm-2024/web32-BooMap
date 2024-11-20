import { UserService } from './../user/user.service';
import { Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { Redis } from 'ioredis';
import { RedisService } from '@liaoliaots/nestjs-redis';

@Injectable()
export class ConnectionService {
  private readonly redis: Redis | null;

  constructor(
    private readonly redisService: RedisService,
    private readonly UserService: UserService,
  ) {
    this.redis = this.redisService.getOrThrow();
  }

  async createMindmap() {
    const uuid = uuidv4();

    await this.redis.sadd('mindmapIds', uuid);
    //uuid 디비저장 -> 제목없음응로 저장?
    return uuid;
  }

  async createGuestMindmap() {
    const uuid = uuidv4();
    await this.redis.sadd('mindmapIds', uuid);
    //uuid 디비저장 -> 제목없음응로 저장?
    return uuid;
  }
}
