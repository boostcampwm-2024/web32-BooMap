import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { configDotenv } from 'dotenv';
configDotenv();

export const typeormConfig: TypeOrmModuleOptions = {
  type: 'mysql',
  host: process.env.DB_HOST ?? 'host.docker.internal',
  port: parseInt(process.env.DB_PORT ?? '3306'),
  username: process.env.DB_USERNAME ?? 'test-user',
  password: process.env.DB_PASSWORD ?? 'test',
  database: process.env.DB_DATABASE ?? 'test',
  entities: [__dirname + '/../**/*.entity.{js,ts}'],
  synchronize: true,
};
