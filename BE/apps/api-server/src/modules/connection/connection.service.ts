import { MindmapService } from './../mindmap/mindmap.service';
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
    private readonly userService: UserService,
    private readonly mindmapService: MindmapService,
  ) {
    this.redis = this.redisService.getOrThrow();
  }

  async createConnection(userId: number) {
    const user = await this.userService.findById(userId);
    const ConnectionId = await this.mindmapService.create(user);

    await this.redis.sadd('mindmapIds', ConnectionId);
    //uuid 디비저장 -> 제목없음응로 저장?
    return ConnectionId;
  }

  async createGuestConnection() {
    const uuid = uuidv4();
    await this.redis.sadd('mindmapIds', uuid);
    //uuid 디비저장 -> 제목없음응로 저장?
    return uuid;
  }
}
