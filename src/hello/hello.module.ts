import { Module } from "@nestjs/common";
import { HelloController } from "./hello.controller";
import { HelloGateway } from "./hello.gateway";
import { HelloService } from "./hello.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Hello } from "./entities/hello.entity";
import { User } from "src/users/entities/user.entity";
import { Auction } from "src/auctions/entities/auction.entity";

@Module({
    imports: [TypeOrmModule.forFeature([Hello, User, Auction])],
    exports: [TypeOrmModule],
    controllers: [HelloController],
    providers: [HelloGateway, HelloService],
})
export class HelloModule {}
