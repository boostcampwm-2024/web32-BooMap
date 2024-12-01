import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { WinstonModule } from 'nest-winston';
import { RedisModule } from '@liaoliaots/nestjs-redis';
import { TypeOrmModule } from '@nestjs/typeorm';
import { getWinstonConfig, getTypeOrmConfig, getRedisConfig, getJwtConfig } from '@app/config';
import { MapModule } from './modules/map/map.module';

import { join } from 'path';
import { JwtModule } from '@nestjs/jwt';
import { SubscriberModule } from './modules/subscriber/subscriber.module';
import { PublisherModule } from '@app/publisher';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [join(__dirname, '..', '..', '..', '.env')],
    }),
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
    JwtModule.registerAsync({
      global: true,
      inject: [ConfigService],
      useFactory: getJwtConfig,
    }),
    MapModule,
    SubscriberModule,
    PublisherModule,
  ],
  controllers: [],
  providers: [],
  exports: [],
})
export class AppModule {}
