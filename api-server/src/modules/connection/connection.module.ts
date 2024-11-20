import { Module } from '@nestjs/common';
import { ConnectionController } from './connection.controller';
import { ConnectionService } from './connection.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../user/entities';

@Module({
  controllers: [ConnectionController],
  imports: [TypeOrmModule.forFeature([User])],
  providers: [ConnectionService],
})
export class ConnectionModule {}
