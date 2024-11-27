import { MindmapService } from './../mindmap/mindmap.service';
import { UserService } from './../user/user.service';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Redis } from 'ioredis';
import { RedisService } from '@liaoliaots/nestjs-redis';
import { v4 as uuidv4 } from 'uuid';

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
    const connectionId = await this.mindmapService.create(userId);
    await this.redis.hset(connectionId, { type: 'user' });
    return connectionId;
  }

  async createGuestConnection() {
    const connectionId = uuidv4();
    await this.redis.hset(connectionId, { type: 'guest' });
    return connectionId;
  }

  async setConnection(mindmapId: number, userId: number) {
    const role = await this.userService.getRole(userId, mindmapId);
    if (!role) {
      throw new UnauthorizedException('권한이 없습니다.');
    }

    const mindmapData = await this.mindmapService.getDataByMindmapId(mindmapId);

    try {
      await this.redis.hset(mindmapData.connectionId, {
        type: 'user',
        mindmapId: mindmapId,
        aiCount: mindmapData.aiCount,
        title: mindmapData.title,
      });

      await this.redis.set(`mindmapState:${mindmapData.connectionId}`, JSON.stringify(mindmapData.nodes));
      await this.redis.set(`content:${mindmapData.connectionId}`, mindmapData.content);
    } catch (error) {
      throw error;
    }

    return {
      connectionId: mindmapData.connectionId,
      role: role,
    };
  }
}
