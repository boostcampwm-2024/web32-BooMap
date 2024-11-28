import { InjectRepository } from '@nestjs/typeorm';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { In, Repository } from 'typeorm';
import { Mindmap, UserMindmapRole, Node } from '@app/entity';
import { v4 as uuidv4 } from 'uuid';
import { UpdateMindmapDto } from './dto/update.mindmap.dto';
import { Role } from '@app/entity/enum/role.enum';
import { NodeService } from '../node/node.service';

@Injectable()
export class MindmapService {
  constructor(
    @InjectRepository(Mindmap) private mindmapRepository: Repository<Mindmap>,
    @InjectRepository(UserMindmapRole) private userMindmapRoleRepository: Repository<UserMindmapRole>,
    private nodeService: NodeService,
  ) {}

  async create(userId: number) {
    const uuid = uuidv4();
    const mindmap = this.mindmapRepository.create({ connectionId: uuid, aiContent: '', content: '' });
    const savedMindmap = await this.mindmapRepository.save(mindmap);
    await this.assignUserToMindmap(userId, savedMindmap.id);
    return { connectionId: uuid, mindmapId: savedMindmap.id };
  }

  createGuest() {
    const uuid = uuidv4();
    return uuid;
  }

  async assignUserToMindmap(userId: number, mindmapId: number, role: Role = Role.OWNER) {
    const existingRole = await this.userMindmapRoleRepository.findOne({
      where: {
        user: { id: userId },
        mindmap: { id: mindmapId },
      },
    });

    if (existingRole) {
      return existingRole;
    }

    const userMindmapRole = this.userMindmapRoleRepository.create({
      user: { id: userId },
      mindmap: { id: mindmapId },
      role,
    });

    return await this.userMindmapRoleRepository.save(userMindmapRole);
  }

  async findAllByUserId(userId: number) {
    const myRoles = await this.userMindmapRoleRepository.find({
      where: { user: { id: userId } },
      relations: ['mindmap'],
    });

    if (!myRoles.length) {
      return [];
    }

    return myRoles.map((record) => record.mindmap);
  }

  async update(mindmapId: number, updateMindmapDto: UpdateMindmapDto) {
    await this.mindmapRepository.update({ id: mindmapId }, updateMindmapDto);
  }

  async delete(mindmapId: number, userId: number) {
    const role = await this.userMindmapRoleRepository.findOne({
      where: { user: { id: userId }, mindmap: { id: mindmapId } },
    });

    if (role.role !== Role.OWNER) {
      throw new UnauthorizedException('권한이 없습니다.');
    }

    return await this.mindmapRepository.manager.transaction(async (manager) => {
      const nodes = await manager.find(Node, {
        where: {
          mindmap: {
            id: mindmapId,
          },
        },
      });
      for (const node of nodes) {
        const descendants = await manager.getTreeRepository(Node).findDescendants(node);
        await manager.remove(descendants);
      }

      return manager.delete(Mindmap, { id: mindmapId });
    });
  }

  async getDataByMindmapId(mindmapId: number) {
    const mindmap = await this.mindmapRepository.findOne({ where: { id: mindmapId } });
    const nodes = await this.nodeService.tableToCanvas(mindmapId);

    return {
      title: mindmap.title,
      content: mindmap.content,
      aiCount: mindmap.aiCount,
      connectionId: mindmap.connectionId,
      nodes,
    };
  }

  async getOwner(mindmapId: number | number[]) {
    if (Array.isArray(mindmapId)) {
      const owners = await this.userMindmapRoleRepository.find({
        where: { mindmap: { id: In(mindmapId) }, role: Role.OWNER },
        relations: ['user', 'mindmap'],
      });
      return owners.map((owner) => {
        return {
          mindmapId: owner.mindmap.id,
          userId: owner.user.id,
          ownerName: owner.user.name,
        };
      });
    }
    const owner = await this.userMindmapRoleRepository.findOne({
      where: { mindmap: { id: mindmapId }, role: Role.OWNER },
      relations: ['user', 'mindmap'],
    });
    return [
      {
        mindmapId: owner.mindmap.id,
        userId: owner.user.id,
        ownerName: owner.user.name,
      },
    ];
  }
}
