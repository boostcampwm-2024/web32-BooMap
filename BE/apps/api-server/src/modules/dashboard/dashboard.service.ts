import { NodeService } from './../node/node.service';
import { MindmapService } from './../mindmap/mindmap.service';
import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class DashboardService {
  constructor(
    private readonly mindmapService: MindmapService,
    private readonly nodeService: NodeService,
  ) {}

  async findAll(userId: number) {
    try {
      const mindmapList = await this.mindmapService.findAllByUserId(userId);

      if (!mindmapList.length) {
        return [];
      }

      const mindmapIds = mindmapList.map((mindmap) => mindmap.id);
      const owners = await this.mindmapService.getOwner(mindmapIds);
      const keywords = await Promise.all(mindmapIds.map((id) => this.nodeService.findKeywordByMindmapId(id)));

      return mindmapList.map((mindmap, index) => ({
        id: mindmap.id,
        connectionId: mindmap.connectionId,
        title: mindmap.title,
        keyword: keywords[index],
        createDate: mindmap.createdDate,
        modifiedDate: mindmap.modifiedDate,
        owner: owners.find((owner) => owner.mindmapId === mindmap.id)?.ownerName,
      }));
    } catch (error) {
      Logger.error(error);
      throw error;
    }
  }
}
