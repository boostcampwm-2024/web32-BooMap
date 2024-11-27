import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User, UserMindmapRole } from '@app/entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, UserMindmapRole])],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
