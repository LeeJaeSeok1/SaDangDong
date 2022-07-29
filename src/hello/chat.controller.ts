import { Controller, Get, Param, Query } from "@nestjs/common";
import { ChatService } from "./chat.service";
import { ApiOperation, ApiTags, ApiQuery } from "@nestjs/swagger";

@ApiTags("Chat")
@Controller("api/chat")
export class ChatController {
    constructor(private readonly chatService: ChatService) {}

    @Get(":auction_id")
    findAllMessages(@Param(":auction_id") auction_id: number) {
        return this.chatService.findAllMessages(auction_id);
    }
}
