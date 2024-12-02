import { InjectRepository } from '@nestjs/typeorm';
import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { In, Repository } from 'typeorm';
import { Mindmap, UserMindmapRole } from '@app/entity';
import { v4 as uuidv4 } from 'uuid';
import { UpdateMindmapDto } from './dto/update.mindmap.dto';
import { Role } from '@app/entity/enum/role.enum';
import { NodeService } from '../node/node.service';
import { MindmapException } from '../../exceptions';

@Injectable()
export class MindmapService {
  private readonly logger = new Logger(MindmapService.name);
  constructor(
    @InjectRepository(Mindmap) private mindmapRepository: Repository<Mindmap>,
    @InjectRepository(UserMindmapRole) private userMindmapRoleRepository: Repository<UserMindmapRole>,
    private nodeService: NodeService,
  ) {}

  async create(userId: number) {
    try {
      const uuid = uuidv4();
      const mindmap = this.mindmapRepository.create({ connectionId: uuid, aiContent: '', content: '' });
      const savedMindmap = await this.mindmapRepository.save(mindmap);
      await this.assignUserToMindmap(userId, savedMindmap.id);
      return savedMindmap.id;
    } catch (error) {
      this.logger.error(error);
      throw new MindmapException('마인드맵 생성에 실패했습니다.');
    }
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
      select: ['mindmap'],
    });

    if (!myRoles) {
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

    await this.mindmapRepository.softRemove({ id: mindmapId });
    await this.userMindmapRoleRepository.softDelete({ mindmap: { id: mindmapId } });
  }

  async getDataByMindmapId(mindmapId: number) {
    const mindmap = await this.mindmapRepository.findOne({ where: { id: mindmapId } });
    const nodes = await this.nodeService.tableToCanvas(mindmap.id);
    if (!mindmap) {
      throw new MindmapException('마인드맵을 찾을 수 없습니다.');
    }

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

  async getMindmapByConnectionId(connectionId: string) {
    return await this.mindmapRepository.findOne({ where: { connectionId } });
  }
}
