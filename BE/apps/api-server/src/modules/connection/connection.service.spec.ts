import { Test, TestingModule } from '@nestjs/testing';
import { ConnectionService } from './connection.service';
import { RedisService } from '@liaoliaots/nestjs-redis';
import { Redis } from 'ioredis';

describe('ConnectionService', () => {
  let service: ConnectionService;
  let redisService: jest.Mocked<RedisService>;
  let redisMock: jest.Mocked<Redis>;

  beforeEach(async () => {
    redisMock = {
      sadd: jest.fn(),
      srem: jest.fn(),
      sismember: jest.fn(),
    } as any;

    redisService = {
      getOrThrow: jest.fn().mockReturnValue(redisMock),
    } as any;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ConnectionService,
        {
          provide: RedisService,
          useValue: redisService,
        },
      ],
    }).compile();

    service = module.get<ConnectionService>(ConnectionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
