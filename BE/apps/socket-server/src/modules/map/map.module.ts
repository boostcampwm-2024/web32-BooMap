import { Module } from '@nestjs/common';
import { MapGateway } from './map.gateway';
import { MapService } from './map.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Node } from '@app/entity';
import { WsOptionalJwtGuard } from '../../guard/ws.jwt.auth.guard';
import { PubsubModule } from '../pubsub/pubsub.module';

@Module({
  imports: [TypeOrmModule.forFeature([Node]), PubsubModule],
  providers: [MapGateway, MapService, WsOptionalJwtGuard],
})
export class MapModule {}
