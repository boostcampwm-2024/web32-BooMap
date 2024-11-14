import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Test } from './entity/test.entity';
import { TestDto } from './dto/test.dto';

@Injectable()
export class TestService {
  constructor(@InjectRepository(Test) private testRepository: Repository<Test>) {}

  async getCount(id: number = 1): Promise<TestDto> {
    const test = await this.testRepository.findOneBy({ id });
    if (!test) {
      const newCount = await this.createCount();
      const testDto: TestDto = { count: newCount.count };
      return testDto;
    }
    return this.incrementCount(test);
  }

  async createCount(): Promise<Test> {
    const test = this.testRepository.create({ count: 0 });
    return await this.testRepository.save(test);
  }

  private async incrementCount(test: Test): Promise<TestDto> {
    test.count++;
    await this.testRepository.save(test);
    const testDto: TestDto = { count: test.count };
    return testDto;
  }
}
