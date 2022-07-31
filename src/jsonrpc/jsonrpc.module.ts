import { Module } from "@nestjs/common";
import { JsonRpcController } from "./jsonrpc.controller";
import { JsonRpcService } from "./jsonrpc.service";

@Module({
    imports: [
        // HttpModule.register({
        //     timeout: 5000,
        //     maxRedirects: 5,
        // }),
    ],
    controllers: [JsonRpcController],
    providers: [JsonRpcService],
})
export class JsonRpcModule {}
