import { RedisService } from '@liaoliaots/nestjs-redis';
import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class SubscriberService implements OnModuleInit {
  private readonly subscriberRedis: Redis;
  private readonly generalRedis: Redis;
  private readonly logger = new Logger(SubscriberService.name);

  constructor(private readonly redisService: RedisService) {
    this.subscriberRedis = redisService.getOrThrow('subscriber');
    this.generalRedis = redisService.getOrThrow('general');
  }

  onModuleInit() {
    this.subscribeToChannel();
  }

  private subscribeToChannel() {
    this.subscriberRedis.subscribe('api-socket', (err) => {
      if (err) {
        this.logger.error('Redis subscribe error:', err);
        return;
      }
      this.logger.log(`Subscribed to api-socket channel`);
    });

    this.subscriberRedis.on('message', this.handleMessage.bind(this));
  }

  private async handleMessage(channel: string, message: string) {
    if (channel !== 'api-socket') return;

    try {
      const { event, data } = JSON.parse(message);
      // ai 완료 이벤트 구독
    } catch (error) {
      this.logger.error('Error processing message:', error);
    }
  }

  aiTextFinish() {
    console.log('aiTextFinish');
  }

  aiAudioFinish() {
    console.log('aiAudioFinish');
  }
}
