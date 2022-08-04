import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CreateAuctionDto } from "./dto/createAuction.dto";
import { getOneAuctionDto } from "./dto/getOneAuction.dto";
import { Item } from "src/items/entities/item.entity";
import { User } from "src/users/entities/user.entity";
import { Auction } from "./entities/auction.entity";
import { create_date, date_calculate } from "src/plug/caculation.function";
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

    async startAuction(token_id: string, price: any, address: string) {
        try {
            if (address == `"NOT DEFINED"`) {
                return Object.assign({
                    statusCode: 400,
                    success: true,
                    statusMsg: `메타마스크에 연결하십시오.`,
                });
            }
            const [[NFTtoken], [Check_auction]] = await Promise.all([
                this.itemRepository.query(`
                SELECT item.token_id
                FROM item
                WHERE item.token_id ="${token_id}" 
                AND item.owner = "${address}"
                `),
                this.auctionRepository.query(`
                SELECT *
                FROM auction
                WHERE auction.token_id = "${token_id}"
                AND transaction_at > ADDTIME(now(),'9:0:0.000000')
                `),
            ]);

            if (!NFTtoken) {
                return Object.assign({
                    statusCode: 400,
                    statusMsg: `없는 토큰입니다.`,
                });
            }

            if (Check_auction) {
                return Object.assign({
                    statusCode: 400,
                    statusMsg: `경매중입니다.`,
                });
            }

            const { start, end } = create_date();

            const new_date = new Date(end);
            new_date.setHours(new_date.getHours() + 6);

            const auction = new Auction();
            auction.price = price.price;
            auction.token_id = token_id;
            auction.started_at = start;
            auction.ended_at = end;
            auction.progress = true;
            auction.transaction = false;
            auction.transaction_at = new_date;
            auction.address = address;
            console.log(auction.id);

            await this.auctionRepository.save(auction);
            console.log(1);
            const bidding = new Bidding();
            bidding.price = auction.price;
            bidding.auctionId = auction.id;
            bidding.address = address;
            console.log(2);
            await this.biddingRepository.save(bidding);

            return Object.assign({
                statusCode: 200,
                statusMsg: `옥션을 불러왔습니다.`,
                data: auction,
            });
        } catch (error) {
            console.log(error.message);
            throw new BadRequestException(error.message);
        }
    }

    async getOneAuction(token_id: string) {
        try {
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

            const remained_at = date_calculate(auction.ended_at);

            auction.remained_at = remained_at;

            return Object.assign({
                statusCode: 200,
                statusMsg: `${token_id} 옥션을 불러왔습니다.`,
                data: auction,
            });
        } catch (error) {
            throw new BadRequestException(error.message);
        }
    }

    getAllAuction(): Promise<Auction[]> {
        return this.auctionRepository.find();
    }
}
