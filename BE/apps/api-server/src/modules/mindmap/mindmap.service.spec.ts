import { Test, TestingModule } from '@nestjs/testing';
import { MindmapService } from './mindmap.service';

describe('MindmapService', () => {
  let service: MindmapService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MindmapService],
    }).compile();

    service = module.get<MindmapService>(MindmapService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
