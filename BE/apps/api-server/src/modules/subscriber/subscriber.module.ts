import { Module } from '@nestjs/common';
import { SubscriberService } from './subscriber.service';
import { NodeModule } from '../node/node.module';
import { MindmapModule } from '../mindmap/mindmap.module';
import { AiModule } from '../ai/ai.module';

@Module({
  imports: [NodeModule, MindmapModule, AiModule],
  providers: [SubscriberService],
  exports: [SubscriberService],
})
export class SubscriberModule {}
