import { MindmapService } from './../mindmap/mindmap.service';
import { UserService } from './../user/user.service';
import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { Redis } from 'ioredis';
import { RedisService } from '@liaoliaots/nestjs-redis';
import { v4 as uuidv4 } from 'uuid';
import { ConnectionException } from '../../exceptions';

@Injectable()
export class ConnectionService {
  private readonly logger = new Logger(ConnectionService.name);
  private readonly GeneralRedis: Redis | null;

  constructor(
    private readonly redisService: RedisService,
    private readonly userService: UserService,
    private readonly mindmapService: MindmapService,
  ) {
    this.GeneralRedis = this.redisService.getOrThrow('general');
  }

  async createConnection(userId: number) {
    const { connectionId, mindmapId } = await this.mindmapService.create(userId);
    await this.GeneralRedis.hset(connectionId, { type: 'user', mindmapId: mindmapId });
    return connectionId;
  }

  async createGuestConnection() {
    const connectionId = uuidv4();
    await this.GeneralRedis.hset(connectionId, { type: 'guest' });
    return connectionId;
  }

  async setConnection(mindmapId: number, userId: number) {
    try {
      const role = await this.userService.getRole(userId, mindmapId);
      const owner = await this.mindmapService.getOwner(mindmapId);
      if (!role) {
        throw new UnauthorizedException('권한이 없습니다.');
      }

      const mindmapData = await this.mindmapService.getDataByMindmapId(mindmapId);
      await this.GeneralRedis.hset(mindmapData.connectionId, {
        type: 'user',
        mindmapId: mindmapId,
        aiCount: mindmapData.aiCount,
        title: mindmapData.title,
        ownerId: owner.pop().userId,
      });

      await this.GeneralRedis.set(`mindmapState:${mindmapData.connectionId}`, JSON.stringify(mindmapData.nodes));
      await this.GeneralRedis.set(`content:${mindmapData.connectionId}`, mindmapData.content);

      return {
        connectionId: mindmapData.connectionId,
        role: role,
      };
    } catch (error) {
      this.logger.error(error);
      if (error instanceof UnauthorizedException) {
        throw error;
      } else {
        throw new ConnectionException(error.message);
      }
    }
  }
}
