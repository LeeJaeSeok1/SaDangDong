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
import { AuthToken } from "src/config/auth.decorator";

@WebSocketGateway({ namespace: "offer", cors: { origin: "*" } })
export class OfferGateway {
    @WebSocketServer() public server: Server;

    constructor(private readonly offerService: OfferService) {}

    @SubscribeMessage("OffertoServer")
    async createOffer(
        @MessageBody() data: { price: number; mycoin: number },
        @AuthToken() address: string,
        @Param("auction_id") auction_id: string,
    ) {
        console.log(data, address, auction_id);
        const myoffer = await this.offerService.createOffer(address, data, auction_id);
        this.server.emit("offer", myoffer);
        return myoffer;
    }

    @SubscribeMessage("findAllOffers")
    findAllOffer(@AuthToken() address: string, @Param("auction_id") auction_id: string) {
        return this.offerService.findAllOffer(address, auction_id);
    }

    @SubscribeMessage("join")
    joinRoom(@MessageBody() data: { auction_id: number; address: string }, @ConnectedSocket() client: Socket) {
        console.log(data, client.id);
        return this.offerService.joinRoom(data, client.id);
    }
}
