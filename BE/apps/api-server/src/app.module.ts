import { MiddlewareConsumer, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { WinstonModule } from 'nest-winston';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RedisModule } from '@liaoliaots/nestjs-redis';
import { getWinstonConfig, getTypeOrmConfig, getRedisConfig, getJwtConfig } from '@app/config';
import { ConnectionModule } from './modules/connection/connection.module';
import { LoggerMiddleware } from './middlewares/logger.middleware';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { join } from 'path';
import { MindmapModule } from './modules/mindmap/mindmap.module';
import { NodeModule } from './modules/node/node.module';
import { DashboardModule } from './modules/dashboard/dashboard.module';
import { PubsubModule } from './modules/pubsub/pubsub.module';
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
    RedisModule.forRootAsync(
      {
        inject: [ConfigService],
        useFactory: getRedisConfig,
      },
      true, // isGlobal
    ),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: getTypeOrmConfig,
    }),
    JwtModule.registerAsync({
      global: true,
      inject: [ConfigService],
      useFactory: getJwtConfig,
    }),
    ConnectionModule,
    UserModule,
    AuthModule,
    MindmapModule,
    NodeModule,
    DashboardModule,
    PubsubModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
