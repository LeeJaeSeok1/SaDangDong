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
import { parse_Kcalculate } from "src/plug/caculation.function";
import { CreateOfferDto } from "./dto/createoffer.dto";
import { OfferService } from "./offer.service";

@WebSocketGateway({ namespace: "offer", cors: { origin: "*" } })
export class OfferGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
    constructor(private offerService: OfferService) {}

    @WebSocketServer() server: Server;

    @SubscribeMessage("sendOffer")
    async handleSendMessage(client: Socket, data: CreateOfferDto) {
        const date = new Date();
        const Kdate = parse_Kcalculate(date, 9);
        const newData = {
            name: data.name,
            created_at: Kdate,
            price: data.price,
            auctionId: data.auction_id,
            address: data.address,
        };

        this.server.to(`${data.auction_id}`).emit("recOffer", newData);
        // data : {price, mycoin}
    }

    @SubscribeMessage("joinRoom")
    handleJoinRoom(client: Socket, room: string) {
        console.log(room);
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

    handleDisconnect(client: Socket) {
        console.log(`Disconnected: ${client.id}`);
        //Do stuffs
    }

    handleConnection(client: Socket, ...args: any[]) {
        console.log(`Connected ${client.id}`);
        //Do stuffs
    }
}
