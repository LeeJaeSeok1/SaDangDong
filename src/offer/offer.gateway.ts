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
import { Controller, Get, Post, Body, Patch, Param, Delete, Logger } from "@nestjs/common";
import { onlineMap } from "./onlineMap";
import { OfferService } from "./offer.service";

@WebSocketGateway({ cors: { origin: "*" } })
export class OfferGateway {
    @WebSocketServer() server: Server;

    constructor(private readonly offerService: OfferService) {}

    @SubscribeMessage("OffertoServer")
    async create(@MessageBody() offer: string) {
        const myoffer = await this.offerService.create();

        // this.server.emit('offer', offer);
        return myoffer;
    }

    @SubscribeMessage("findAllOffers")
    findAll() {
        return this.offerService.findAll();
    }

    @SubscribeMessage("join")
    joinRoom(@MessageBody("name") name: string, @ConnectedSocket() client: Socket) {
        return this.offerService.indentify(name, client.id);
    }

    @SubscribeMessage("typiing")
    async typing(@MessageBody("isTyping") isTyping: boolean, @ConnectedSocket() client: Socket) {
        const name = await this.offerService.getClientName(client.id);

        client.broadcast.emit("typing", { name, isTyping });
    }
}
