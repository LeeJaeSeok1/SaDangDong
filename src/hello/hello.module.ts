import { CacheModule, Module } from "@nestjs/common";
import { HelloController } from "./hello.controller";
import { HelloGateway } from "./hello.gateway";
import { HelloService } from "./hello.service";

@Module({
    imports: [],
    controllers: [HelloController],
    providers: [HelloGateway, HelloService],
})
export class HelloModule {}
