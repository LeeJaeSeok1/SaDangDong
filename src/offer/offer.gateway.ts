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
import { OfferService } from "./offer.service";

@WebSocketGateway({ namespace: "offer", cors: { origin: "*" } })
export class OfferGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
    constructor(private offerService: OfferService) {}

    @WebSocketServer() server: Server;

    @SubscribeMessage("sendOffer")
    async handleSendMessage(client: Socket, { address, price, mycoin, auction_id }): Promise<void> {
        console.log(address, price, mycoin, auction_id);
        const newData = await this.offerService.createOffer(address, price, mycoin, auction_id);
        console.log(newData);
        // data : {price, mycoin}
        this.server.to(`${auction_id}`).emit("recOffer", newData);
    }

    @SubscribeMessage("joinRoom")
    handleJoinRoom(client: Socket, room: string) {
        console.log(room);
        client.join(room);
        client.emit("joinRoom", room);
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
