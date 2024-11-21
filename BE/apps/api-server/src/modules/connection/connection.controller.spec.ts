import { Test, TestingModule } from '@nestjs/testing';
import { ConnectionController } from './connection.controller';
import { ConnectionService } from './connection.service';

describe('ConnectionController', () => {
  let controller: ConnectionController;
  let connectionService: jest.Mocked<ConnectionService>;

  beforeEach(async () => {
    connectionService = {
      createMindmapId: jest.fn(),
    } as any;

    const module: TestingModule = await Test.createTestingModule({
      controllers: [ConnectionController],
      providers: [
        {
          provide: ConnectionService,
          useValue: connectionService,
        },
      ],
    }).compile();

    controller = module.get<ConnectionController>(ConnectionController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
