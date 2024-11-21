import { Test, TestingModule } from '@nestjs/testing';
import { MapGateway } from './map.gateway';

describe('MapGateway', () => {
  let gateway: MapGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MapGateway],
    }).compile();

    gateway = module.get<MapGateway>(MapGateway);
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });
});
