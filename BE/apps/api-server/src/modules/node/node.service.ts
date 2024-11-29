import { Node } from '@app/entity';
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, TreeRepository } from 'typeorm';
import { NodeDto } from './dto/node.dto';
import { UpdateNodeDto } from './dto/update.node.dto';

@Injectable()
export class NodeService {
  private readonly logger = new Logger(NodeService.name);
  constructor(@InjectRepository(Node) private nodeRepository: TreeRepository<Node>) {}

  async findKeywordByMindmapId(mindmapId: number) {
    const nodeList = await this.nodeRepository.find({ where: { mindmap: { id: mindmapId } } });
    return nodeList.map((node) => node.keyword);
  }

  async tableToCanvas(mindmapId: number) {
    const rootNode = await this.nodeRepository.findOne({
      where: { mindmap: { id: mindmapId }, depth: 1 },
    });

    if (!rootNode) {
      return {};
    }

    const nodeTree = await this.nodeRepository.findDescendants(rootNode, { relations: ['children'] });

    const nodeTreeArray = nodeTree.map((node) => ({
      id: node.id,
      keyword: node.keyword,
      depth: node.depth,
      location: { x: node.locationX, y: node.locationY },
      children: node.children.map((child) => child.id),
    }));

    return Object.fromEntries(nodeTreeArray.map((node) => [node.id, node]));
  }

  async canvasToTable(canvasData: Record<number, NodeDto>, mindmapId: number) {
    const dbNodes = await this.nodeRepository.find({ where: { mindmap: { id: mindmapId } } });
    const dbNodeIds = dbNodes.map((node) => node.id);
    const canvasNodeIds = Object.keys(canvasData).map(Number);
    const deleteNodeIds = dbNodeIds.filter((id) => !canvasNodeIds.includes(id));

    const updateData = Object.values(canvasData).map((node) => {
      return {
        id: node.id,
        keyword: node.keyword,
        locationX: node.location.x,
        locationY: node.location.y,
        depth: node.depth,
      } as UpdateNodeDto;
    });

    await this.deleteNodes(deleteNodeIds);
    await this.updateNode(updateData);
    this.logger.log('데이터 저장 끝');
  }

  async deleteNodes(deleteNodeId: number[] | number) {
    if (Array.isArray(deleteNodeId)) {
      const nodesToDelete = await this.nodeRepository.findBy({ id: In(deleteNodeId) });
      await this.nodeRepository.softRemove(nodesToDelete);
      return;
    }

    const nodeToDelete = await this.nodeRepository.findOne({ where: { id: deleteNodeId } });
    if (nodeToDelete) {
      await this.nodeRepository.softRemove(nodeToDelete);
    }
  }

  async updateNode(updateData: UpdateNodeDto | UpdateNodeDto[]) {
    if (Array.isArray(updateData)) {
      await Promise.all(updateData.map((data) => this.nodeRepository.update(data.id, data)));
      return;
    }
    await this.nodeRepository.update(updateData.id, updateData);
  }
}
