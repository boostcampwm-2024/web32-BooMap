import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Mindmap, User } from '@app/entity';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class MindmapService {
  constructor(private mindmapRepository: Repository<Mindmap>) {}

  async create(user: User) {
    const uuid = uuidv4();
    const mindmap = this.mindmapRepository.create();
    mindmap.aiCount = 5;
    mindmap.title = '제목없음';
    mindmap.user = user;
    return uuid;
  }

  findAll() {
    return `This action returns all mindmap`;
  }

  findOne(id: number) {
    return `This action returns a #${id} mindmap`;
  }

  update(id: number) {
    return `This action updates a #${id} mindmap`;
  }

  remove(id: number) {
    return `This action removes a #${id} mindmap`;
  }
}
