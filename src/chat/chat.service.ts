import { BadRequestException, Injectable } from "@nestjs/common";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { Auction } from "src/auctions/entities/auction.entity";
import { User } from "src/users/entities/user.entity";
import { createMessageDto } from "./dto/createMessage.dto";
import { Chat } from "./entities/chat.entity";

@Injectable()
export class ChatService {
    constructor(
        @InjectRepository(Auction)
        private auctionRepository: Repository<Auction>,
        @InjectRepository(User)
        private userRepository: Repository<User>,
        @InjectRepository(Chat)
        private chatRepository: Repository<Chat>,
    ) {} // private userRepository: Repository<User>, // @InjectRepository(User) // private auctionRepository: Repository<Auction>, // @InjectRepository(Auction) // private itemRepository: Repository<Item>, // @InjectRepository(Item) // private collectionRepository: Repository<Collection>, // @InjectRepository(Collection)

    async createMessage(data: createMessageDto) {
        //todo
        try {
            const myMessage = new Chat();
            myMessage.address = data.address;
            myMessage.auction_id = data.auction_id;
            myMessage.message = data.message;

            await this.chatRepository.save(myMessage);

            return "성공했습니다.";
        } catch (error) {
            throw new BadRequestException(error.message);
        }
    }

    async findAllMessages(auction_id: number) {
        try {
            const AllMessages = await this.chatRepository.query(`
            SELECT chat.*, user.name
            FROM chat, user
            WHERE chat.auction_id = ${auction_id}
            AND user.address = chat.address
            `);

            return AllMessages;
        } catch (error) {
            throw new BadRequestException(error.message);
        }
    }
}
