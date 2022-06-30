import { Test, TestingModule } from '@nestjs/testing';
import { SellController } from './sell.controller';
import { SellService } from './sell.service';

describe('SellController', () => {
  let controller: SellController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SellController],
      providers: [SellService],
    }).compile();

    controller = module.get<SellController>(SellController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
