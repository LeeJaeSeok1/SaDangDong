import {
    Logger,
    CACHE_MANAGER,
    UseInterceptors,
    Inject,
    Injectable,
    Get,
    CacheInterceptor,
} from "@nestjs/common";
import { OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import { Cache } from "cache-manager";
import {Redis} from 'ioredis';

@Injectable()
@WebSocketGateway({ namespace: "/chat", cors: { origin: "*" } })
export class ChatGateway implements OnGatewayInit {
    constructor(
        @Inject(CACHE_MANAGER) private cacheManager: Cache
        ) {}

    @WebSocketServer() wss: Server;

    private logger: Logger = new Logger("ChatGateway");

    afterInit(server: any) {
        this.logger.log("Initialized!");
    }

    async setKey(key: string, value: string): Promise<boolean> {
        await this.cacheManager.set(key, value);
        return true;
    }

    async getKey(key: string): Promise<string> {
        const rtn = (await this.cacheManager.get(key)) as string;
        return rtn;
    }
    
    @UseInterceptors(CacheInterceptor)
    @SubscribeMessage("chatToServer")
    async handleMessage(client: Socket, message: { sender: string; room: string; message: string }): Promise<void>{
        console.log(message);
        this.wss.to(message.room).emit("chatToClient", message);
        await this.cacheManager.set(`api:chat`, message, { ttl: 60 });
    }

    @SubscribeMessage("joinRoom")
    handleJoinRoom(client: Socket, room: string) {
        console.log(room)
        client.join(room);
        client.emit("joinRoom", room);

    }

    @SubscribeMessage("leaveRoom")
    handleLeaveRoom(client: Socket, room: string) {
        client.leave(room);
        client.emit("leftRoom", room);
    }
}
