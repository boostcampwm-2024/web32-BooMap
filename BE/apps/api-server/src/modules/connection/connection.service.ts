import { MindmapService } from './../mindmap/mindmap.service';
import { UserService } from './../user/user.service';
import { ForbiddenException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { Redis } from 'ioredis';
import { RedisService } from '@liaoliaots/nestjs-redis';
import { v4 as uuidv4 } from 'uuid';

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
    const mindmapId = await this.mindmapService.create(userId);
    return await this.setConnection(mindmapId, userId);
  }

  async createGuestConnection() {
    const connectionId = uuidv4();
    await Promise.all([
      this.GeneralRedis.hset(connectionId, { type: 'guest', aiCount: 0, title: '제목없음' }),
      this.GeneralRedis.set(`mindmapState:${connectionId}`, JSON.stringify({})),
      this.GeneralRedis.set(`content:${connectionId}`, ''),
    ]);
    return { connectionId, role: 'owner' };
  }

  async getConnection(connectionId: string, userId: number) {
    const mindmap = await this.mindmapService.getMindmapByConnectionId(connectionId);
    if (!mindmap) {
      throw new NotFoundException('마인드맵을 찾을 수 없습니다.');
    }
    return await this.setConnection(mindmap.id, userId);
  }

  async setConnection(mindmapId: number, userId: number) {
    const role = await this.userService.getRole(userId, mindmapId);
    if (role === undefined) {
      throw new ForbiddenException('권한이 없습니다.');
    }

    const owner = await this.mindmapService.getOwner(mindmapId);
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
      mindmapId,
      connectionId: mindmapData.connectionId,
      role: role,
    };
  }
}
