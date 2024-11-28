import { RedisService } from '@liaoliaots/nestjs-redis';
import { Injectable } from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class PublisherService {
  private readonly redis: Redis;
  constructor(private readonly redisService: RedisService) {
    this.redis = redisService.getOrThrow('publisher');
  }

  async publish(channel: string, message: string) {
    await this.redis.publish(channel, message);
  }
}
