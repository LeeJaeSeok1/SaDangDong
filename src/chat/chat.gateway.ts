import {
    Logger,
    CACHE_MANAGER,
    CacheTTL,
    UseInterceptors,
    HttpException,
    Inject,
    Injectable,
    Controller,
} from "@nestjs/common";
import {
    ConnectedSocket,
    MessageBody,
    OnGatewayConnection,
    OnGatewayDisconnect,
    OnGatewayInit,
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer,
} from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import { ChatService } from "./chat.service";
import { createMessageDto } from "./dto/createMessage.dto";

@WebSocketGateway({ namespace: "/chat", cors: { origin: "*" } })
export class ChatGateway implements OnGatewayInit {
    constructor(private chatService: ChatService) {}
    @WebSocketServer() public server: Server;

    @SubscribeMessage("sendMessage")
    handleSendMessage(client: Socket, data: createMessageDto) {
        // this.chatService.createMessage(data);
        this.server.to(`${data.auction_id}`).emit("recMessage", data);
    }

    @SubscribeMessage("joinRoom")
    handleJoinRoom(client: Socket, room: string) {
        client.join(room);
        client.emit("joinRoom", room);
    }

    @SubscribeMessage("leaveRoom")
    handleErrorRoom(client: Socket, room: string) {
        console.log(room);
        client.leave(room);
        client.emit("leaveRoom", room);
    }

    afterInit(server: Server) {
        console.log(server);
        //Do stuffs
    }
}
