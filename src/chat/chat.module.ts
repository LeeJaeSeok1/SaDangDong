import { Module } from "@nestjs/common";
import { ChatController } from "./chat.controller";
import { ChatGateway } from "./chat.gateway";
import { ChatService } from "./chat.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "src/users/entities/user.entity";
import { Auction } from "src/auctions/entities/auction.entity";
import { Chat } from "./entities/chat.entity";

@Module({
    imports: [TypeOrmModule.forFeature([Chat, User, Auction])],
    exports: [TypeOrmModule],
    controllers: [ChatController],
    providers: [ChatGateway, ChatService],
})
export class ChatModule {}
