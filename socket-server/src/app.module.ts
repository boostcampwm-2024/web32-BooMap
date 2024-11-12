import { Module } from '@nestjs/common';

import { ConfigModule, ConfigService } from '@nestjs/config';
import { WinstonModule } from 'nest-winston';
import { getWinstonConfig } from './configs/logger.config';
import { RedisModule } from '@liaoliaots/nestjs-redis';
import { getRedisConfig } from './configs/redis.config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { getTypeOrmConfig } from './configs/typeorm.config';

import { MapModule } from './modules/map/map.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    WinstonModule.forRootAsync({
      inject: [ConfigService],
      useFactory: getWinstonConfig,
    }),
    RedisModule.forRootAsync({
      inject: [ConfigService],
      useFactory: getRedisConfig,
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: getTypeOrmConfig,
    }),
    MapModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
