import { Test, TestingModule } from '@nestjs/testing';
import { MindmapController } from './mindmap.controller';

describe('MindmapController', () => {
  let controller: MindmapController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MindmapController],
    }).compile();

    controller = module.get<MindmapController>(MindmapController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
