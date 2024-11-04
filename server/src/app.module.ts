import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TestModule } from './modules/test/test.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeormConfig } from './configs/typeorm.config';
@Module({
  imports: [TypeOrmModule.forRoot(typeormConfig), TestModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
