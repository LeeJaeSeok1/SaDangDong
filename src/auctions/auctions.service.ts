import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CreateAuctionDto } from "./dto/createAuction.dto";
import { getOneAuctionDto } from "./dto/getOneAuction.dto";
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

    async startAuction(token_id: string, createAuctionDto: CreateAuctionDto, address: string) {
        const NFTtoken = await this.itemRepository.query(`
        SELECT item.token_id
        FROM item
        WHERE item.token_id =${token_id} AND item.owner = ${address}
        `);

        if (NFTtoken.length === 0) {
            return "없는 token 입니다.";
        }

        const Check_auction = await this.auctionRepository.query(`
        SELECT *
        FROM auction
        WHERE auction.token_id = ${token_id} AND auction.progress = true
        `);

        if (Check_auction.length !== 0) {
            return "이미 경매중입니다.";
        }

        console.log(NFTtoken);

        // 날짜 선정
        const UTC_date = new Date();
        const start = new Date();
        start.setHours(UTC_date.getHours() + 9);
        const end = new Date(start);
        end.setDate(start.getDate() + 1);

        const auction = new Auction();
        auction.price = createAuctionDto.price;
        auction.token_id = NFTtoken;
        auction.started_at = start;
        auction.ended_at = end;
        auction.progress = true;

        return await this.auctionRepository.save(auction);
    }

    async getOneAuction(token_id: string) {
        console.log(token_id);
        const auction = await this.auctionRepository.query(`
            SELECT auction.price, auction.token_id, auction.ended_at,
            item.collection_name, item.owner, item.name, item.description,
            item.address
            FROM auction, item
            WHERE auction.token_id = ${token_id} 
            AND auction.token_id = item.token_id
            AND auction.progress = true
        `);

        if (!auction) {
            return "없는 토큰입니다.";
        }

        // console.log(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(), date.getMinutes(), date.getSeconds())
        const UTC_date = new Date();
        const now_date = new Date();
        now_date.setHours(UTC_date.getHours() + 9);

        const remained_time: number = auction.ended_at.getTime() - now_date.getTime();
        const fixed_time = new Date(remained_time).toISOString().split("T")[1].split(".")[0];

        return { auction, fixed_time };
    }

    getAllAuction(): Promise<Auction[]> {
        return this.auctionRepository.find();
    }
}
