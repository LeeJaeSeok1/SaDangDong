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
import { HelloService } from "./hello.service";
import { createMessageDto } from "./dto/createMessage.dto";

@WebSocketGateway({ namespace: "/hello", cors: { origin: "*" } })
export class HelloGateway implements OnGatewayInit {
    constructor(private helloService: HelloService) {}
    @WebSocketServer() public server: Server;

    @SubscribeMessage("sendMessage")
    handleSendMessage(client: Socket, data: createMessageDto) {
        console.log(data, "date");
        this.helloService.createMessage(data);
        this.server.to(`${data.auction_id}`).emit("recMessage", data);
    }

    @SubscribeMessage("joinRoom")
    joinRoom(client: Socket, room) {
        console.log(room, "room");
        console.log(typeof room);
        client.join(room);
    }

    afterInit(server: Server) {
        console.log(server);
        //Do stuffs
    }
}
