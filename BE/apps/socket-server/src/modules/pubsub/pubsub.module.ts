import { Module } from '@nestjs/common';
import { PublisherService } from './publisher.service';
import { SubscriberService } from './subscriber.service';

@Module({
  providers: [PublisherService, SubscriberService],
  exports: [PublisherService, SubscriberService],
})
export class PubsubModule {}
