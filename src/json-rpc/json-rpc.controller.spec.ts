import { Test, TestingModule } from '@nestjs/testing';
import { JsonRpcController } from './json-rpc.controller';
import { JsonRpcService } from './json-rpc.service';

describe('JsonRpcController', () => {
  let controller: JsonRpcController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [JsonRpcController],
      providers: [JsonRpcService],
    }).compile();

    controller = module.get<JsonRpcController>(JsonRpcController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
