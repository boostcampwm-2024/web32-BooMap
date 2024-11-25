import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Mindmap, User } from '@app/entity';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class MindmapService {
  constructor(@InjectRepository(Mindmap) private mindmapRepository: Repository<Mindmap>) {}

  async create(user: User) {
    const uuid = uuidv4();
    const mindmap = this.mindmapRepository.create();
    mindmap.aiCount = 5;
    mindmap.title = '제목없음';
    mindmap.user = user;
    mindmap.connectionId = uuid;
    await this.mindmapRepository.save(mindmap);

    return uuid;
  }

  createGuest() {
    const uuid = uuidv4();
    return uuid;
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
