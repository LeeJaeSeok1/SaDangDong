import { CacheModule, Module } from "@nestjs/common";
import { HelloGateway } from "./hello.gateway";

@Module({
    imports: [],
    controllers: [],
    providers: [HelloGateway],
})
export class HelloModule {}
