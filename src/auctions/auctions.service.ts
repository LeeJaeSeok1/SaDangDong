import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CreateAuctionDto } from "./dto/createAuction.dto";
import { getOneAuctionDto } from "./dto/getOneAuction.dto";
import { Item } from "src/items/entities/item.entity";
import { User } from "src/users/entities/user.entity";
import { Auction } from "./entities/auction.entity";
import { create_date, date_calculation } from "src/plug/date.function";
import { Bidding } from "src/offer/entities/bidding.entity";

@Injectable()
export class AuctionsService {
    constructor(
        @InjectRepository(Auction)
        private auctionRepository: Repository<Auction>,
        @InjectRepository(Item)
        private itemRepository: Repository<Item>,
        @InjectRepository(User)
        private userRepository: Repository<User>,
        @InjectRepository(Bidding)
        private biddingRepository: Repository<Bidding>,
    ) {}

    async startAuction(token_id: string, price, address: string) {
        try {
            const NFTtoken = await this.itemRepository.query(`
            SELECT item.token_id
            FROM item
            WHERE item.token_id ="${token_id}" AND item.owner = "${address}"
            `);

            if (NFTtoken.length === 0) {
                return "없는 token 입니다.";
            }

            const Check_auction = await this.auctionRepository.query(`
            SELECT *
            FROM auction
            WHERE auction.token_id = "${token_id}" AND auction.progress = true
            `);

            if (Check_auction.length !== 0) {
                return "이미 경매중입니다.";
            }

            const { start, end } = create_date();

            const auction = new Auction();
            auction.price = price.price;
            auction.token_id = token_id;
            auction.started_at = start;
            auction.ended_at = end;
            auction.progress = true;

            console.log(auction);

            await this.auctionRepository.save(auction);

            const bidding = new Bidding();
            bidding.price = auction.price;

            await this.biddingRepository.save(bidding);

            return { auction, bidding };
        } catch (error) {
            throw new BadRequestException(error.message);
        }
    }

    async getOneAuction(token_id: string) {
        console.log(token_id);
        const [auction] = await this.auctionRepository.query(`
            SELECT auction.price, auction.token_id, auction.ended_at,
            item.collection_name, item.owner, item.name, item.description,
            item.address, item.image
            FROM auction, item
            WHERE auction.token_id = "${token_id}" 
            AND auction.token_id = item.token_id
            AND auction.progress = true
        `);
        console.log(auction);
        if (!auction) {
            return "없는 토큰입니다.";
        }

        const limited_time = date_calculation(auction.ended_at);

        return { auction, limited_time };
    }

    getAllAuction(): Promise<Auction[]> {
        return this.auctionRepository.find();
    }
}
