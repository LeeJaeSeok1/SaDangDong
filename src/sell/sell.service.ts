import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Auction } from "src/auctions/entities/auction.entity";
import { Item } from "src/items/entities/item.entity";
import { Bidding } from "src/offer/entities/bidding.entity";
import { Offer } from "src/offer/entities/offer.entity";
import { now_date, weekly_calculate } from "src/plug/caculation.function";
import { User } from "src/users/entities/user.entity";
import { Repository } from "typeorm";
import { CreateSellDto } from "./dto/create-sell.dto";
import { UpdateSellDto } from "./dto/update-sell.dto";
import { Sell } from "./entities/sell.entity";

@Injectable()
export class SellService {
    constructor(
        @InjectRepository(Sell)
        private sellRepository: Repository<Sell>,
        @InjectRepository(User)
        private userRepository: Repository<User>,
        @InjectRepository(Bidding)
        private biddingRepository: Repository<Bidding>,
        @InjectRepository(Offer)
        private OfferRepository: Repository<Offer>,
        @InjectRepository(Item)
        private itemRepository: Repository<Item>,
        @InjectRepository(Auction)
        private auctionRepository: Repository<Auction>,
    ) {}
    async SellComplete(createSellDto: CreateSellDto, auction_id: number) {
        try {
            console.log(createSellDto, auction_id);
            const nowDate = now_date();
            const [auction] = await this.auctionRepository.query(`
            SELECT *
            FROM auction
            WHERE id = ${auction_id}
            `);
            if (!auction) {
                return "경매를 하지 않았거나 종료되었습니다.";
            }

            if (auction.ended_at > nowDate) {
                return "아직 경매가 끝나지 않았습니다.";
            }

            const [[bidding], [item]] = await Promise.all([
                this.biddingRepository.query(`
                SELECT *
                FROM bidding
                WHERE auctionId = ${auction_id}
                `),
                this.itemRepository.query(`
                SELECT *
                FROM item
                WHERE token_id = ${auction.token_id}
                `),
            ]);

            if (!bidding || !item) {
                return "경매를 하지 않았습니다.";
            }

            const [SellCount] = await this.sellRepository.query(`
            SELECT *
            FROM sell
            WHERE address = ${bidding.address}
            AND start_at <= ${nowDate}
            AND ${nowDate} < end_at
            `);

            item.owner = bidding.address;
            auction.progress = false;

            if (SellCount) {
                SellCount.count++;
                await Promise.all([
                    this.sellRepository.update(SellCount.id, SellCount),
                    this.auctionRepository.update(auction.id, auction),
                    this.itemRepository.update(item.token_id, item),
                ]);
            } else {
                const { start_date, end_date } = weekly_calculate();
                const newSellCount = new Sell();
                newSellCount.count = 0;
                newSellCount.address = bidding.address;
                newSellCount.start_at = start_date;
                newSellCount.end_at = end_date;

                await Promise.all([
                    this.sellRepository.save(newSellCount),
                    this.auctionRepository.update(auction.id, auction),
                    this.itemRepository.update(item.token_id, item),
                ]);
            }

            return "경매를 성공적으로 거래했습니다.";
        } catch (error) {
            throw new BadRequestException(error.message);
        }
    }

    findAll() {
        return `This action returns all sell`;
    }
}
