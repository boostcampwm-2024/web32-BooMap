import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MapModule } from './modules/map/map.module';

@Module({
  imports: [MapModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
