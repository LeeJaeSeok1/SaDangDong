import { Test, TestingModule } from '@nestjs/testing';
import { SellService } from './sell.service';

describe('SellService', () => {
  let service: SellService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SellService],
    }).compile();

    service = module.get<SellService>(SellService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
