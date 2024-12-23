import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User, UserMindmapRole } from '@app/entity';
import { Repository } from 'typeorm';
import { UserCreateDto, UserInfoDto } from './dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(UserMindmapRole) private readonly userMindmapRoleRepository: Repository<UserMindmapRole>,
  ) {}

  async createGithubUser(user: UserCreateDto) {
    const createdUser = this.userRepository.create({ email: user.email, name: user.name, type: 'github' });
    return await this.userRepository.save(createdUser);
  }

  async findByGithubEmail(email: string) {
    return await this.userRepository.findOne({ where: { email, type: 'github' } });
  }

  async createKakaoUser(user: UserCreateDto) {
    const createdUser = this.userRepository.create({ email: user.email, name: user.name, type: 'kakao' });
    return await this.userRepository.save(createdUser);
  }

  async findByKakaoEmail(email: string) {
    return await this.userRepository.findOne({ where: { email, type: 'kakao' } });
  }

  async findById(id: number) {
    return await this.userRepository.findOne({ where: { id } });
  }

  async getUserInfo(userId: number) {
    const user = await this.userRepository.findOne({ where: { id: userId } });

    return {
      id: user.id,
      name: user.name,
      email: user.email,
    } as UserInfoDto;
  }

  async getRole(userId: number, mindmapId: number) {
    const userMindmapRole = await this.userMindmapRoleRepository.findOne({
      where: { user: { id: userId }, mindmap: { id: mindmapId } },
    });

    return userMindmapRole?.role;
  }
}
