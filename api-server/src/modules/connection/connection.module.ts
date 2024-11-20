import { Module } from '@nestjs/common';
import { ConnectionController } from './connection.controller';
import { ConnectionService } from './connection.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../user/entities';
import { UserModule } from '../user/user.module';

@Module({
  controllers: [ConnectionController],
  imports: [TypeOrmModule.forFeature([User]), UserModule],
  providers: [ConnectionService],
})
export class ConnectionModule {}
