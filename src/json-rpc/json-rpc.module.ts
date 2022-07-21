import { Module } from '@nestjs/common';
import { JsonRpcService } from './json-rpc.service';
import { JsonRpcController } from './json-rpc.controller';

@Module({
  controllers: [JsonRpcController],
  providers: [JsonRpcService]
})
export class JsonRpcModule {}
