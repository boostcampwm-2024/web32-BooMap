import { Module } from '@nestjs/common';
import { ConnectionController } from './connection.controller';
import { ConnectionService } from './connection.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '@app/entity';
import { UserModule } from '../user/user.module';
import { MindmapModule } from '../mindmap/mindmap.module';

@Module({
  controllers: [ConnectionController],
  imports: [TypeOrmModule.forFeature([User]), UserModule, MindmapModule],
  providers: [ConnectionService],
})
export class ConnectionModule {}
