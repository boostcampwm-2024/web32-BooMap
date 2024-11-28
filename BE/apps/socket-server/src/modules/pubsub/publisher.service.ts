import { RedisService } from '@liaoliaots/nestjs-redis';
import { Injectable, Logger } from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class PublisherService {
  private readonly redis: Redis;
  private readonly logger = new Logger(PublisherService.name);
  constructor(private readonly redisService: RedisService) {
    this.redis = redisService.getOrThrow('publisher');
  }

  async publish(channel: string, message: string) {
    this.logger.log(`Publishing to ${channel}: ${message}`);
    await this.redis.publish(channel, message);
  }
}
