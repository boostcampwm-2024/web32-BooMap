import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { WinstonModule } from 'nest-winston';
import { RedisModule } from '@liaoliaots/nestjs-redis';
import { TypeOrmModule } from '@nestjs/typeorm';

import { getWinstonConfig, getTypeOrmConfig, getRedisConfig } from './configs';
import { MapModule } from './modules/map/map.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: '../../.env' }),
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
