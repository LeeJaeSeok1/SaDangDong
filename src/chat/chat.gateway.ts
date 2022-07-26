// import { Logger, CACHE_MANAGER, CacheTTL, UseInterceptors, HttpException, Inject, Injectable } from "@nestjs/common";
// import { OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
// import { Server, Socket } from "socket.io";
// import { Cache } from "cache-manager";
// // import { HttpCacheInterceptor } from '../interceptor/http-cache.interceptor';

// @Injectable()
// @WebSocketGateway({ namespace: "/chat", cors: { origin: "*" } })
// export class ChatGateway implements OnGatewayInit {
//     constructor(@Inject(CACHE_MANAGER) private redisManager: Cache) {}

//     @WebSocketServer() wss: Server;

//     private logger: Logger = new Logger("ChatGateway");

//     afterInit(server: any) {
//         this.logger.log("Initialized!");
//     }

//     // @CacheTTL(600)
//     // @UseInterceptors(HttpCacheInterceptor)
//     @SubscribeMessage("chatToServer")
//     async handleMessage(client: Socket, message: { sender: string; room: string; message: string }) {
//         console.log(message);
//         this.wss.to(message.room).emit("chatToClient", message);
//         this.redisManager.get(`api: chat${asdf}`);
//         this.redisManager.set(`api: chat$`, message, { ttl: 60 });
//     }

//     @SubscribeMessage("joinRoom")
//     handleJoinRoom(client: Socket, room: string) {
//         client.join(room);
//         client.emit("joinedRoom", room);
//     }

//     @SubscribeMessage("leaveRoom")
//     handleLeaveRoom(client: Socket, room: string) {
//         client.leave(room);
//         client.emit("leftRoom", room);
//     }
// }

// // import { Logger } from '@nestjs/common';
// // import {
// //   OnGatewayConnection,
// //   OnGatewayDisconnect,
// //   OnGatewayInit,
// //   SubscribeMessage,
// //   WebSocketGateway,
// //   WebSocketServer,
// // } from '@nestjs/websockets';
// // import { Server, Socket } from 'socket.io';

// // @WebSocketGateway({ namespace: 'chat' })
// // export class ChatGateway
// //   implements OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit {
// //   private static readonly logger = new Logger(ChatGateway.name);

// //   @WebSocketServer()
// //   server: Server;

// //   afterInit() {
// //     ChatGateway.logger.debug(`Socket Server Init Complete`);
// //   }

// //   handleConnection(client: Socket) {
// //     ChatGateway.logger.debug(
// //       `${client.id}(${client.handshake.query['username']}) is connected!`,
// //     );

// //     this.server.emit('msgToClient', {
// //       name: `admin`,
// //       text: `join chat.`,
// //     });
// //   }

// //   handleDisconnect(client: Socket) {
// //     ChatGateway.logger.debug(`${client.id} is disconnected...`);
// //   }

// //   @SubscribeMessage('msgToServer')
// //   handleMessage(client: Socket, message: { name: string; text: string }): void {
// //     this.server.emit('msgToClient', message);
// //   }
// // }
