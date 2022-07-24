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
import { Logger } from "@nestjs/common";
import { onlineMap } from "./onlineMap";
import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Auction } from "src/auctions/entities/auction.entity";
import { Bidding } from "src/offer/entities/bidding.entity";
import { Offer } from "./entities/offer.entity";

@WebSocketGateway(8080, { namespace: "/offer" })
export class OfferGateway implements OnGatewayInit {
    constructor(
        @InjectRepository(Auction)
        private auctionRepository: Repository<Auction>,
        @InjectRepository(Bidding)
        private biddingRepository: Repository<Bidding>,
        @InjectRepository(Offer)
        private offerRepository: Repository<Offer>,
    ) {}

    @WebSocketServer() wss: Server;

    private logger: Logger = new Logger("OfferGateway");

    afterInit(server: any) {
        this.logger.log("Initialized!");
    }

    @SubscribeMessage("OfferToServer")
    handleMessage(client: Socket, message: { sender: string; room: string; offer: number }) {
        console.log(message);
        this.wss.to(message.room).emit("OfferToClient", message);
    }

    @SubscribeMessage("joinOfferRoom")
    handleRoomJoin(client: Socket, room: string) {
        console.log(room);
        client.join(room);
        client.emit("joinedRoom", room);
    }

    @SubscribeMessage("leaveOfferRoom")
    handleRoomLeave(client: Socket, room: string) {
        client.leave(room);
        client.emit("leftRoom", room);
    }
}
