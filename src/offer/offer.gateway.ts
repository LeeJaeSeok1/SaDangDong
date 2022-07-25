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
    @WebSocketServer() server: Server;

    constructor(private readonly offerService: OfferService) {}

    @SubscribeMessage("OffertoServer")
    async createOffer(
        @MessageBody() offer: number,
        @AuthToken() address: string,
        @Param("auction_id") auction_id: string,
    ) {
        console.log(offer, address, auction_id);
        const myoffer = await this.offerService.createOffer(address, offer, auction_id);

        // this.server.emit('offer', offer);
        return myoffer;
    }

    @SubscribeMessage("findAllOffers")
    findAllOffer(@AuthToken() address: string, @Param("auction_id") auction_id: string) {
        return this.offerService.findAllOffer(address, auction_id);
    }

    @SubscribeMessage("join")
    joinRoom(@MessageBody("name") name: string, @ConnectedSocket() client: Socket) {
        return this.offerService.indentify(name, client.id);
    }

    @SubscribeMessage("typing")
    async typing(@MessageBody("isTyping") isTyping: boolean, @ConnectedSocket() client: Socket) {
        const name = await this.offerService.getClientName(client.id);

        client.broadcast.emit("typing", { name, isTyping });
    }
}
