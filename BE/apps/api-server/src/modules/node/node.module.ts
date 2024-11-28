import { Module } from '@nestjs/common';
import { NodeService } from './node.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Node } from '@app/entity';

@Module({
  imports: [TypeOrmModule.forFeature([Node])],
  providers: [NodeService],
  exports: [NodeService],
})
export class NodeModule {}
