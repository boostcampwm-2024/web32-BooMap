import { Module } from '@nestjs/common';
import { MapGateway } from './map.gateway';
import { MapService } from './map.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Node } from './entity/node.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Node])],
  providers: [MapGateway, MapService],
})
export class MapModule {}
