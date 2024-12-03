import { UpdateMindmapDto } from 'apps/socket-server/src/modules/map/dto';
import { RedisService } from '@liaoliaots/nestjs-redis';
import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import Redis from 'ioredis';
import { NodeService } from '../node/node.service';
import { MindmapService } from '../mindmap/mindmap.service';
import { plainToInstance } from 'class-transformer';
import { Role } from '@app/entity/enum/role.enum';
import { AiService } from '../ai/ai.service';
import { AiDto } from '../ai/dto/ai.dto';

export interface RedisMessage {
  event: string;
  data: {
    connectionId: string;
    aiContent?: string;
    userId?: string;
    mindmapId?: string;
  };
}

@Injectable()
export class SubscriberService implements OnModuleInit {
  private readonly subscriberRedis: Redis;
  private readonly generalRedis: Redis;
  private readonly logger = new Logger(SubscriberService.name);

  constructor(
    private readonly redisService: RedisService,
    private readonly nodeService: NodeService,
    private readonly mindmapService: MindmapService,
    private readonly aiService: AiService,
  ) {
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
    try {
      if (channel === 'api-socket') {
        const { event, data } = JSON.parse(message) as RedisMessage;
        if (event === 'save') {
          this.logger.log('데이터 저장 요청 수신');
          await this.handleSaveEvent(data);
        } else if (event === 'join') {
          await this.handleJoinEvent(data);
        } else if (event === 'textAiApi') {
          await this.handleTextAiEvent(data);
        }
      }
    } catch (error) {
      this.logger.error('Error processing message:', error);
    }
  }

  private async handleSaveEvent(data: RedisMessage['data']) {
    this.logger.log(`Received save event for connectionId: ${data.connectionId}`);
    const [mindmapData, nodeData, content] = await Promise.all([
      this.generalRedis.hgetall(data.connectionId),
      this.generalRedis.get(`mindmapState:${data.connectionId}`),
      this.generalRedis.get(`content:${data.connectionId}`),
    ]);

    if (!nodeData) {
      this.logger.error(`No node data found for connectionId: ${data.connectionId}`);
      return;
    }

    const updateData = plainToInstance(UpdateMindmapDto, {
      title: mindmapData.title,
      content: content ?? '', // null 안전 처리
      aiCount: mindmapData.aiCount,
    });

    try {
      const parsedNodeData = JSON.parse(nodeData);
      await this.nodeService.canvasToTable(parsedNodeData, Number(mindmapData.mindmapId));
      await this.mindmapService.update(Number(mindmapData.mindmapId), updateData);
    } catch (error) {
      this.logger.error(`saveData 이벤트 처리 실패: ${error}`);
    }
  }

  private async handleJoinEvent(data: RedisMessage['data']) {
    try {
      const userId = Number(data?.userId);
      const mindmapId = Number(data?.mindmapId);
      if (!userId || !mindmapId) {
        this.logger.error('Invalid join event data:', data);
        return;
      }
      await this.mindmapService.assignUserToMindmap(Number(data.userId), Number(data.mindmapId), Role.EDITOR);
    } catch (error) {
      this.logger.error('Error processing join event:', error);
    }
  }

  private async handleTextAiEvent(data: RedisMessage['data']) {
    const mindmapId = Number(data.mindmapId);
    const connectionId = data.connectionId;
    const aiContent = data.aiContent;
    const ClovaPromptDto = plainToInstance(AiDto, { mindmapId, connectionId, aiContent });
    await this.aiService.requestOpenAi(ClovaPromptDto);
    this.logger.log('AI 데이터 처리 완료');
  }
}
