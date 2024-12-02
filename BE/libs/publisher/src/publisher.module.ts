import { Global, Module } from '@nestjs/common';
import { PublisherService } from './publisher.service';

@Global()
@Module({
  providers: [PublisherService],
  exports: [PublisherService],
})
export class PublisherModule {}
