import { CacheModule, Module } from "@nestjs/common";
// import { ChatGateway } from "./chat.gateway";
import * as redisStore from "cache-manager-ioredis";
import { ChatGateway } from "./chat.controller";

@Module({
    imports: [
        CacheModule.registerAsync({
            useFactory: () => ({
                store: redisStore,
                host: "localhost",
                port: 6379, // Redis의 기본 포트번호이다.
            }),
        }),
    ],
    controllers: [ChatGateway],
    providers: [],
})
export class ChatModule {}
