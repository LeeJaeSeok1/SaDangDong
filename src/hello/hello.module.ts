import { CacheModule, Module } from "@nestjs/common";
import { HelloGateway } from "./hello.gateway";

@Module({
    imports: [],
    controllers: [HelloGateway],
    providers: [],
})
export class HelloModule {}
