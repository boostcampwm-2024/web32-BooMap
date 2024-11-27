import { Module } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { DashboardController } from './dashboard.controller';
import { MindmapModule } from '../mindmap/mindmap.module';
import { NodeModule } from '../node/node.module';

@Module({
  controllers: [DashboardController],
  imports: [MindmapModule, NodeModule],
  providers: [DashboardService],
})
export class DashboardModule {}
