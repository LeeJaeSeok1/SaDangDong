import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CreateAuctionDto } from "./dto/createAuction.dto";
import { Item } from "src/items/entities/item.entity";
import { User } from "src/users/entities/user.entity";
import { Auction } from "./entities/auction.entity";

@Injectable()
export class AuctionsService {
    constructor(
        @InjectRepository(Auction)
        private auctionRepository: Repository<Auction>,
        @InjectRepository(Item)
        private itemRepository: Repository<Item>,
        @InjectRepository(User)
        private userRepository: Repository<User>,
    ) {}

    async createAuction(token_id: string, createAuctionDto: CreateAuctionDto) {
        const item = await this.itemRepository.findOne({ where: { token_id } });

        const auction = new Auction();
        // auction.price = createAuctionDto.price;
        // auction.biddingPrice = createAuctionDto.biddingPrice;

        return await this.auctionRepository.save(auction);
    }

    getAllAuction(): Promise<Auction[]> {
        return this.auctionRepository.find();
    }

    getOneAuction(id: number): Promise<Auction> {
        const auctionItem = this.auctionRepository.findOne({ where: { id } });
        console.log(auctionItem);
        return auctionItem;
    }
}
