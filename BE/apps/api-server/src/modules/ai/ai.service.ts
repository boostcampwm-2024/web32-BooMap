import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { NodeService } from '../node/node.service';
import { ConfigService } from '@nestjs/config';
import { PublisherService } from '@app/publisher';
import { AudioUploadDto } from './dto/audio.upload.dto';
import { AiDto } from './dto/ai.dto';
import OpenAI from 'openai';
import { OpenAiRequestDto } from './dto/openai.request.dto';
import { ClovaSpeechRequestDto } from './dto/clova.speech.request.dtd';
import { plainToInstance } from 'class-transformer';
import { OPENAI_PROMPT } from 'apps/api-server/src/common/constant';
import { RedisService } from '@liaoliaots/nestjs-redis';
import Redis from 'ioredis';

export interface TextAiResponse {
  keyword: string;
  children: TextAiResponse[];
}

@Injectable()
export class AiService {
  private readonly logger = new Logger(AiService.name);
  private readonly redis: Redis | null;
  constructor(
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
    private readonly nodeService: NodeService,
    private readonly publisherService: PublisherService,
    private readonly redisService: RedisService,
  ) {
    this.redis = redisService.getOrThrow('general');
  }

  async requestOpenAi(aiDto: AiDto) {
    try {
      const aiCount = await this.redis.hget(aiDto.connectionId, 'aiCount');
      if (Number(aiCount) <= 0) {
        this.publisherService.publish('api-socket', {
          event: 'textAiSocket',
          data: { error: 'AI 사용 횟수가 모두 소진되었습니다.', connectionId: aiDto.connectionId },
        });
        return;
      }
      const apiKey = this.configService.get('OPENAI_API_KEY');
      const openai = new OpenAI(apiKey);

      const openAiRequestDto = new OpenAiRequestDto();
      openAiRequestDto.setPrompt(OPENAI_PROMPT);
      openAiRequestDto.setAiContent(aiDto.aiContent);

      const response = await openai.chat.completions.create(openAiRequestDto.toObject());

      const result = JSON.parse(response.choices[0].message.content) as TextAiResponse;
      console.log(result);
      const nodeData = await this.nodeService.aiCreateNode(result, aiDto.mindmapId);
      this.publisherService.publish('api-socket', {
        event: 'textAiSocket',
        data: { nodeData, connectionId: aiDto.connectionId },
      });
    } catch (error) {
      this.logger.error('OPENAI 요청 에러 : ' + error);
      this.publisherService.publish('api-socket', {
        event: 'textAiSocket',
        data: { error: '텍스트 변환 요청에 실패했습니다.', connectionId: aiDto.connectionId },
      });
    }
  }

  async requestClovaSpeech(audioFile: Express.Multer.File, audioUploadDto: AudioUploadDto) {
    try {
      const URL = this.configService.get('CLOVA_SPEECH_URL');
      const apiKey = this.configService.get('X_CLOVASPEECH_API_KEY');
      const formData = new ClovaSpeechRequestDto(apiKey, audioFile);
      const response = await firstValueFrom(
        this.httpService.post(URL, formData.getFormData(), { headers: formData.getHeaders() }),
      );
      const result = response.data.text;

      const aiDto = plainToInstance(AiDto, {
        aiContent: result,
        connectionId: audioUploadDto.connectionId,
        mindmapId: audioUploadDto.mindmapId,
      });
      await this.requestOpenAi(aiDto);
    } catch (error) {
      this.logger.error('CLOVA-SPEECH 요청 에러 : ' + error);
      this.publisherService.publish('api-socket', {
        event: 'textAiSocket',
        data: { error: '음성 변환 요청에 실패했습니다.', connectionId: audioUploadDto.connectionId },
      });
      throw new BadRequestException('음성 변환 요청에 실패했습니다.');
    }
  }
}
