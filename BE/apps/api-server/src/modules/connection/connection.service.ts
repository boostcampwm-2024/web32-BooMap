import { MindmapService } from './../mindmap/mindmap.service';
import { UserService } from './../user/user.service';
import { Injectable } from '@nestjs/common';
import { Redis } from 'ioredis';
import { RedisService } from '@liaoliaots/nestjs-redis';

@Injectable()
export class ConnectionService {
  private readonly redis: Redis | null;

  constructor(
    private readonly redisService: RedisService,
    private readonly userService: UserService,
    private readonly mindmapService: MindmapService,
  ) {
    this.redis = this.redisService.getOrThrow();
  }

  async createConnection(userId: number) {
    const user = await this.userService.findById(userId);
    const connectionId = await this.mindmapService.create(user);

    await this.redis.sadd('connectionIds', connectionId);
    return connectionId;
  }

  async createGuestConnection() {
    const connectionId = this.mindmapService.createGuest();

    await this.redis.sadd('connectionIds', connectionId);
    return connectionId;
  }
}
