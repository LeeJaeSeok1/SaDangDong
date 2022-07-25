import { CacheModule, Module } from "@nestjs/common";
import { ChatGateway } from "./chat.gateway";
import * as redisStore from "cache-manager-ioredis";

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
    controllers: [],
    providers: [ChatGateway],
})
export class ChatModule {}
