import { CacheModule, Module } from "@nestjs/common";
import * as redisStore from "cache-manager-ioredis";
import { ChatGateway } from "./chat.controller";
import { CacheDBService} from "./cache.Service"; 
@Module({
    imports: [
        CacheModule.registerAsync({
            useFactory: async () => ({
                store: redisStore,
                host: "localhost",
				ttl: 30,
                port: 6379, // Redis의 기본 포트번호이다.
            }),
        }),
    ],
    controllers: [],
    providers: [ChatGateway, CacheDBService],
})
export class ChatModule {}


