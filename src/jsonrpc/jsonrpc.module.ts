import { Module } from "@nestjs/common";
import { JsonRpcController } from "./jsonrpc.controller";
import { JsonRpcService } from "./jsonrpc.service";

@Module({
    controllers: [JsonRpcController],
    providers: [JsonRpcService],
})
export class JsonRpcModule {}
