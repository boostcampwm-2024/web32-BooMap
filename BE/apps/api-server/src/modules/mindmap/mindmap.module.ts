import { Module } from '@nestjs/common';
import { MindmapService } from './mindmap.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Mindmap, User } from '@app/entity';

@Module({
  imports: [TypeOrmModule.forFeature([Mindmap, User])],
  providers: [MindmapService],
})
export class MindmapModule {}
