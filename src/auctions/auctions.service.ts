import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CreateAuctionDto } from "./dto/createAuction.dto";
import { Item } from "src/items/entities/item.entity";
import { Users } from "src/users/entities/user.entity";
import { Auction } from "./entities/auction.entity";

@Injectable()
export class AuctionsService {
    constructor(
        @InjectRepository(Auction)
        private auctionRepository: Repository<Auction>,
        @InjectRepository(Item)
        private itemRepository: Repository<Item>,
        @InjectRepository(Users)
        private userRepository: Repository<Users>,
    ) {}

    async createAuction(NFTtoken: string, createAuctionDto: CreateAuctionDto, user: Users) {
        const item = await this.itemRepository.findOne({ where: { NFTtoken } });
        const itemId = item.owner;
        const userId = user.id;

        if (itemId !== userId) {
            throw new NotFoundException(`${NFTtoken}의 소유자가 당신이 아닙니다.`);
        }
        const auction = new Auction();
        auction.price = createAuctionDto.price;
        auction.biddingPrice = createAuctionDto.biddingPrice;

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
