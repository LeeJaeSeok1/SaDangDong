import { Module } from "@nestjs/common";
import { JsonRpcController } from "./jsonrpc.controller";
import { JsonRpcService } from "./jsonrpc.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Ethereum } from "./entities/ethereum.entity";
import { HttpModule } from "@nestjs/axios";

@Module({
    imports: [
        TypeOrmModule.forFeature([Ethereum]),
        HttpModule.register({
            timeout: 5000,
        }),
    ],
    exports: [TypeOrmModule],
    controllers: [JsonRpcController],
    providers: [JsonRpcService],
})
export class JsonRpcModule {}
