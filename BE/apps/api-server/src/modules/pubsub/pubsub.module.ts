import { Module } from '@nestjs/common';
import { PublisherService } from './publisher.service';
import { SubscriberService } from './subscriber.service';
import { NodeModule } from '../node/node.module';
import { MindmapModule } from '../mindmap/mindmap.module';

@Module({
  imports: [NodeModule, MindmapModule],
  providers: [PublisherService, SubscriberService],
  exports: [PublisherService, SubscriberService],
})
export class PubsubModule {}
