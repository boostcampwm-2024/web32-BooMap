import { Module } from '@nestjs/common';
import { MapGateway } from './map.gateway';
import { MapService } from './map.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Node } from '@app/entity';
import { WsOptionalJwtGuard } from '../../guards/ws.jwt.auth.guard';

@Module({
  imports: [TypeOrmModule.forFeature([Node])],
  providers: [MapGateway, MapService, WsOptionalJwtGuard],
  exports: [MapGateway, MapService],
})
export class MapModule {}
