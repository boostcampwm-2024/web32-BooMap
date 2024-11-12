import { Controller, Get } from '@nestjs/common';
import { TestService } from './test.service';

@Controller('test')
export class TestController {
  constructor(private readonly testService: TestService) {}

  @Get()
  async getCount(): Promise<string> {
    const testDto = await this.testService.getCount();
    return `Count: ${testDto.count}`;
  }
}
