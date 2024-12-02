import { Module } from '@nestjs/common';
import { AiService } from './ai.service';
import { HttpModule } from '@nestjs/axios';
import { NodeModule } from '../node/node.module';
import { AiController } from './ai.controller';
import { FileValidationPipe } from '../../pipes';

@Module({
  imports: [HttpModule, NodeModule],
  providers: [AiService, FileValidationPipe],
  exports: [AiService],
  controllers: [AiController],
})
export class AiModule {}
