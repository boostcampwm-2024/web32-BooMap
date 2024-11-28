import { Body, Controller, Delete, Param, Put, UseGuards } from '@nestjs/common';
import { MindmapService } from './mindmap.service';
import { AuthGuard } from '@nestjs/passport';
import { User } from '../../decorators';
import { UpdateMindmapDto } from 'apps/socket-server/src/modules/map/dto';

@Controller('mindmap')
@UseGuards(AuthGuard('jwt'))
export class MindmapController {
  constructor(private readonly mindmapService: MindmapService) {}

  @Put(':mindmapId')
  update(@Param('mindmapId') mindmapId: number, @Body() updateMindmapDto: UpdateMindmapDto) {
    return this.mindmapService.update(mindmapId, updateMindmapDto);
  }

  @Delete(':mindmapId')
  delete(@Param('mindmapId') mindmapId: number, @User() user) {
    return this.mindmapService.delete(mindmapId, user.id);
  }
}
