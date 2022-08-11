import { Logger, CACHE_MANAGER, CacheTTL, UseInterceptors, HttpException, Inject, Injectable } from "@nestjs/common";
import { OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import { Cache } from "cache-manager";

@Injectable()
@WebSocketGateway({ namespace: "/chat", cors: { origin: "*" } })
export class ChatGateway implements OnGatewayInit {
    constructor(@Inject(CACHE_MANAGER) private redisManager: Cache) {}

    @WebSocketServer() wss: Server;

    private logger: Logger = new Logger("ChatGateway");

    afterInit(server: any) {
        this.logger.log("Initialized!");
    }

    @SubscribeMessage("chatToServer")
    async handleMessage(client: Socket, message: { sender: string; room: string; message: string }) {
        console.log(message);
        this.wss.to(message.room).emit("chatToClient", message);
        this.redisManager.set(`api: chat`, message, { ttl: 6000 });
    }

    @SubscribeMessage("joinRoom")
    handleJoinRoom(client: Socket, room: string) {
        client.join(room);
        client.emit("joinedRoom", room);
    }

    @SubscribeMessage("leaveRoom")
    handleLeaveRoom(client: Socket, room: string) {
        client.leave(room);
        client.emit("leftRoom", room);
    }
}