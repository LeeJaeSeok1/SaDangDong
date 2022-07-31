import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Auction } from "src/auctions/entities/auction.entity";
import { Item } from "src/items/entities/item.entity";
import { Bidding } from "src/offer/entities/bidding.entity";
import { Offer } from "src/offer/entities/offer.entity";
import { now_date, weekly_calculate } from "src/plug/caculation.function";
import { User } from "src/users/entities/user.entity";
import { Repository } from "typeorm";
import { Sell } from "./entities/sell.entity";
import { Sell_Relation } from "./entities/sell_relation.entity";

@Injectable()
export class SellService {
    constructor(
        @InjectRepository(Sell_Relation)
        private sellrelationRepository: Repository<Sell_Relation>,
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
    async SellComplete(data, auction_id: number, address: string) {
        try {
            console.log(data.price, auction_id, address);
            const price = Number(data.price);

            const [[auction], [bidding]] = await Promise.all([
                this.auctionRepository.query(`
                SELECT *
                FROM auction
                WHERE id = ${auction_id}
                `),
                this.biddingRepository.query(`
                SELECT *
                FROM bidding
                WHERE auctionId = ${auction_id}
                AND bidding.address = "${address}"
                `),
            ]);
            if (bidding.price != price) {
                return Object.assign({
                    statusCode: 400,
                    success: false,
                    statusMsg: `요구 가격이 아닙니다.`,
                });
            }
            if (!auction) {
                return Object.assign({
                    statusCode: 400,
                    success: false,
                    statusMsg: `경매를 하지 않았거나 종료되었습니다.`,
                });
            }
            const nowDate = now_date();
            if (auction.ended_at > nowDate) {
                return Object.assign({
                    statusCode: 400,
                    success: false,
                    statusMsg: `아직 경매가 끝나지 않았습니다.`,
                });
            }

            if (auction.transaction_at < nowDate) {
                return Object.assign({
                    statusCode: 400,
                    success: false,
                    statusMsg: `시간 내에 거래하지 못했습니다.`,
                });
            }

            if (!bidding) {
                return Object.assign({
                    statusCode: 400,
                    success: false,
                    statusMsg: `최고 가격 요청자가 아닙니다.`,
                });
            }

            const [[item], [SellCount]] = await Promise.all([
                this.itemRepository.query(`
                SELECT *
                FROM item
                WHERE token_id = ${auction.token_id}
                `),
                this.sellrelationRepository.query(`
                SELECT *
                FROM sell_relation
                WHERE address = ${bidding.address}
                AND start_at <= ADDTIME(now(),'9:0:0.000000')
                AND ADDTIME(now(),'9:0:0.000000') < end_at
                `),
            ]);

            if (!item) {
                return Object.assign({
                    statusCode: 400,
                    success: false,
                    statusMsg: `없는 아이템입니다.`,
                });
            }

            const from_address = item.owner;

            const newSell = new Sell();

            newSell.auction_id = auction.id;
            newSell.to_address = address;
            newSell.from_address = from_address;
            newSell.price = price;
            newSell.token_id = item.token_id;

            item.owner = bidding.address;
            auction.transaction = true;
            auction.transaction_at = nowDate;

            if (SellCount) {
                SellCount.count++;
                await Promise.all([
                    this.sellRepository.save(newSell),
                    this.sellrelationRepository.update(SellCount.id, SellCount),
                    this.auctionRepository.update(auction.id, auction),
                    this.itemRepository.update(item.token_id, item),
                ]);
            } else {
                const { start_date, end_date } = weekly_calculate();
                const newSellCount = new Sell_Relation();
                newSellCount.count = 1;
                newSellCount.address = from_address;
                newSellCount.start_at = start_date;
                newSellCount.end_at = end_date;

                await Promise.all([
                    this.sellRepository.save(newSell),
                    this.sellrelationRepository.save(newSellCount),
                    this.auctionRepository.update(auction.id, auction),
                    this.itemRepository.update(item.token_id, item),
                ]);
            }

            return Object.assign({
                statusCode: 200,
                success: true,
                statusMsg: `거래를 성공적으로 완성했습니다.`,
            });
        } catch (error) {
            throw new BadRequestException(error.message);
        }
    }

    findAll() {
        return `This action returns all sell`;
    }
}
