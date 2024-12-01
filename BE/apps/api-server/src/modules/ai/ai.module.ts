import { Module } from '@nestjs/common';
import { AiService } from './ai.service';
import { HttpModule } from '@nestjs/axios';
import { NodeModule } from '../node/node.module';

@Module({
  imports: [HttpModule, NodeModule],
  providers: [AiService],
  exports: [AiService],
})
export class AiModule {}
