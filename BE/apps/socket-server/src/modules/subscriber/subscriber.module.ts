import { Module } from '@nestjs/common';
import { SubscriberService } from './subscriber.service';
import { MapModule } from '../map/map.module';

@Module({
  imports: [MapModule],
  providers: [SubscriberService],
})
export class SubscriberModule {}
