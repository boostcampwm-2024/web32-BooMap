import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
  constructor(@InjectRepository(User) private userRepository: Repository<User>) {}

  async createGithubUser(email: string) {
    const user = this.userRepository.create({ email, type: 'github' });
    return await this.userRepository.save(user);
  }

  async findByGithubEmail(email: string) {
    return await this.userRepository.findOne({ where: { email, type: 'github' } });
  }

  async createKakaoUser(email: string) {
    const user = this.userRepository.create({ email, type: 'kakao' });
    return await this.userRepository.save(user);
  }

  async findByKakaoEmail(email: string) {
    return await this.userRepository.findOne({ where: { email, type: 'kakao' } });
  }

  async findById(id: number) {
    return await this.userRepository.findOne({ where: { id } });
  }

  async getUserInfo(userId: number) {
    return await this.userRepository.findOne({ where: { id: userId } });
  }
}
