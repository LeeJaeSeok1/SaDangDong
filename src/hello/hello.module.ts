import { Module } from "@nestjs/common";
import { HelloController } from "./hello.controller";
import { HelloGateway } from "./hello.gateway";
import { HelloService } from "./hello.service";
import { TypeOrmModule } from "@nestjs/typeorm";

@Module({
    imports: [TypeOrmModule.forFeature([])],
    exports: [TypeOrmModule],
    controllers: [HelloController],
    providers: [HelloGateway, HelloService],
})
export class HelloModule {}
