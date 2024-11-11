import { Module } from '@nestjs/common';
import { MapGateway } from './map.gateway';
import { MapService } from './map.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Keyword } from './entity/keyword.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Keyword])],
  providers: [MapGateway, MapService],
})
export class MapModule {}
