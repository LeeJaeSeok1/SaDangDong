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
import { Cache } from "cache-manager";
import { onlineMap } from "./onlineMap";
import { HelloService } from "./hello.service";

@Controller("api")
@WebSocketGateway({ namespace: "/hello", cors: { origin: "*" } })
export class HelloGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
    constructor(private helloService: HelloService) {}
    @WebSocketServer() public server: Server;

    afterInit(server: Server): any {
        console.log("init");
    }

    @SubscribeMessage("test")
    handleTest(@MessageBody() data: string) {
        console.log("test", data);
    }

    @SubscribeMessage("login")
    handleLogin(@MessageBody() data: { id: number; channels: number }, @ConnectedSocket() socket: Socket) {
        const newNamespace = socket.nsp;
        console.log("login", newNamespace);
        console.log("join", socket.nsp.name, data.channels);
        socket.join(`${socket.nsp.name}-${data.channels}`);
    }

    @SubscribeMessage("joinRoom")
    handleConnection(@ConnectedSocket() socket: Socket, room) {
        console.log("connected", socket.nsp.name);
        socket.join(room);
        socket.emit("joinedRoom", room);
        // broadcast to all clients in the given sub-namespace
    }

    handleDisconnect(@ConnectedSocket() socket: Socket) {
        console.log("disconnected", socket.nsp.name);
        const newNamespace = socket.nsp;
        newNamespace.emit("onlineList", socket.nsp.name);
    }
}
