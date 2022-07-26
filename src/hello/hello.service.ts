import { BadRequestException, Injectable } from "@nestjs/common";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { Auction } from "src/auctions/entities/auction.entity";
import { User } from "src/users/entities/user.entity";
import { createMessageDto } from "./dto/createMessage.dto";
import { Hello } from "./entities/hello.entity";

@Injectable()
export class HelloService {
    constructor(
        @InjectRepository(Auction)
        private auctionRepository: Repository<Auction>,
        @InjectRepository(User)
        private userRepository: Repository<User>,
        @InjectRepository(Hello)
        private helloRepository: Repository<Hello>,
    ) {} // private userRepository: Repository<User>, // @InjectRepository(User) // private auctionRepository: Repository<Auction>, // @InjectRepository(Auction) // private itemRepository: Repository<Item>, // @InjectRepository(Item) // private collectionRepository: Repository<Collection>, // @InjectRepository(Collection)

    async createMessage(data: createMessageDto) {
        //todo
        try {
            const myMessage = new Hello();
            myMessage.address = data.address;
            myMessage.auction_id = data.auction_id;
            myMessage.message = data.message;

            await this.helloRepository.save(myMessage);

            return "성공했습니다.";
        } catch (error) {
            throw new BadRequestException(error.message);
        }
    }

    async findAllMessages(auction_id: number) {
        try {
            const AllMessages = await this.helloRepository.query(`
            SELECT hello.*, user.name
            FROM hello, user
            WHERE hello.auction_id = ${auction_id}
            WHERE user.address = hello.address
            `);

            return AllMessages;
        } catch (error) {
            throw new BadRequestException(error.message);
        }
    }
}
