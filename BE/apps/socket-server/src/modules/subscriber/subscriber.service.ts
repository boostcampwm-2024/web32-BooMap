import { RedisService } from '@liaoliaots/nestjs-redis';
import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import Redis from 'ioredis';
import { MapGateway } from '../map/map.gateway';
import { NodeDto } from '../map/dto';

export interface RedisMessage {
  event: string;
  data: {
    connectionId: string;
    aiContent?: string;
    userId?: string;
    mindmapId?: string;
    nodeData?: Record<string, NodeDto>;
    error?: string;
  };
}

@Injectable()
export class SubscriberService implements OnModuleInit {
  private readonly subscriberRedis: Redis;
  private readonly logger = new Logger(SubscriberService.name);

  constructor(
    private readonly redisService: RedisService,
    private readonly mapGateway: MapGateway,
  ) {
    this.subscriberRedis = redisService.getOrThrow('subscriber');
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
    });

    this.subscriberRedis.on('message', this.handleMessage.bind(this));
  }

  private async handleMessage(channel: string, message: string) {
    try {
      if (channel === 'api-socket') {
        const { event, data } = JSON.parse(message) as RedisMessage;
        if (event === 'textAiSocket') {
          this.textAiFinished(data);
        }
      }
    } catch (error) {
      this.logger.error('Redis handlㄴeMessage error:', error);
    }
  }

  textAiFinished(data) {
    if (data.error) {
      this.mapGateway.textAiError(data);
      return;
    }
    this.mapGateway.textAiResponse(data);
  }
}
