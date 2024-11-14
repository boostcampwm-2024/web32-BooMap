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

  describe('createRoom', () => {
    it('새로운 마인드맵 UUID를 반환한다.', async () => {
      const expectedUuid = 'test-uuid-1234';
      connectionService.createMindmapId.mockResolvedValue(expectedUuid);

      const result = await controller.createRoom();

      expect(result).toBe(expectedUuid);
      expect(connectionService.createMindmapId).toHaveBeenCalled();
    });
  });
});
