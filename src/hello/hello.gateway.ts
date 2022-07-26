import { Logger, CACHE_MANAGER, CacheTTL, UseInterceptors, HttpException, Inject, Injectable } from "@nestjs/common";
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
// import { HttpCacheInterceptor } from '../interceptor/http-cache.interceptor';

@WebSocketGateway({ namespace: "/hello", cors: { origin: "*" } })
export class HelloGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer() public server: Server;

    @SubscribeMessage("test")
    handleTest(@MessageBody() data: string) {
        console.log("test", data);
    }

    @SubscribeMessage("login")
    handleLogin(@MessageBody() data: { id: number; channels: number[] }, @ConnectedSocket() socket: Socket) {
        const newNamespace = socket.nsp;
        console.log("login", newNamespace);
        onlineMap[socket.nsp.name][socket.id] = data.id;
        newNamespace.emit("onlineList", Object.values(onlineMap[socket.nsp.name]));
        data.channels.forEach((channel) => {
            console.log("join", socket.nsp.name, channel);
            socket.join(`${socket.nsp.name}-${channel}`);
        });
    }

    afterInit(server: Server): any {
        console.log("init");
    }

    handleConnection(@ConnectedSocket() socket: Socket) {
        console.log("connected", socket.nsp.name);
        if (!onlineMap[socket.nsp.name]) {
            onlineMap[socket.nsp.name] = {};
        }
        // broadcast to all clients in the given sub-namespace
        socket.emit("hello", socket.nsp.name);
    }

    handleDisconnect(@ConnectedSocket() socket: Socket) {
        console.log("disconnected", socket.nsp.name);
        const newNamespace = socket.nsp;
        delete onlineMap[socket.nsp.name][socket.id];
        newNamespace.emit("onlineList", Object.values(onlineMap[socket.nsp.name]));
    }
}
