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
      true,
    ),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: getTypeOrmConfig,
    }),
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: getJwtConfig,
      global: true,
    }),
    ConnectionModule,
    UserModule,
    AuthModule,
    MindmapModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
console.log('env path : ', join(__dirname, '..', '..', '.env'));
