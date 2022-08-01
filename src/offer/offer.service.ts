import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Auction } from "src/auctions/entities/auction.entity";
import { Bidding } from "src/offer/entities/bidding.entity";
import { Offer } from "./entities/offer.entity";
import { User } from "src/users/entities/user.entity";
import { CreateOfferDto } from "./dto/createoffer.dto";
import { now_date, parse_Kcalculate } from "src/plug/caculation.function";

@Injectable()
export class OfferService {
    constructor(
        @InjectRepository(Auction)
        private auctionRepository: Repository<Auction>,
        @InjectRepository(Bidding)
        private biddingRepository: Repository<Bidding>,
        @InjectRepository(Offer)
        private offerRepository: Repository<Offer>,
        @InjectRepository(User)
        private userRepository: Repository<User>,
    ) {}

    async createOffer(auction_id, address, data) {
        try {
            data.price = Number(data.price);
            data.mycoin = Number(data.mycoin);

            const [[auction], [bidding]] = await Promise.all([
                this.auctionRepository.query(`
                SELECT *
                FROM auction
                WHERE id = ${auction_id}
                AND progress = true
                `),
                this.biddingRepository.query(`
                SELECT *
                FROM bidding
                WHERE auctionId = ${auction_id}
                `),
            ]);

            if (!auction) {
                return Object.assign({
                    statusCode: 400,
                    success: false,
                    statusMsg: `없는 경매입니다.`,
                });
            }

            if (auction.address == address) {
                return Object.assign({
                    statusCode: 400,
                    success: false,
                    statusMsg: `본인 경매에 본인이 가격 제시 못합니다.`,
                });
            }

            if (bidding.price >= data.price) {
                return Object.assign({
                    statusCode: 400,
                    success: false,
                    statusMsg: `현재 최고가보다 작습니다.`,
                });
            }

            const totalbidding = await this.biddingRepository.query(`
            SELECT bidding.*
            FROM bidding, auction
            WHERE auction.progress = true
            AND auction.id = bidding.auctionId
            AND bidding.address = "${address}"
            `);

            let total: number = data.price;
            for (let i = 0; i < totalbidding.length; i++) {
                total += totalbidding[i].price;
            }

            if (total > data.mycoin) {
                return Object.assign({
                    statusCode: 400,
                    success: false,
                    statusMsg: `현재 지갑의 보유량보다 경매에 참여한 보유량이 더 많습니다.`,
                });
            }

            const newOffer = new Offer();
            newOffer.price = data.price;
            newOffer.auctionId = auction_id;
            newOffer.address = address;

            bidding.price = data.price;
            bidding.address = address;

            await Promise.all([
                this.offerRepository.save(newOffer),
                this.biddingRepository.update(bidding.id, bidding),
            ]);

            const [name] = await this.userRepository.query(`
            SELECT name
            FROM user
            WHERE address  = "${bidding.address}"
            `);
            console.log("hello");
            console.log(name);

            const date = new Date();
            const Kdate = parse_Kcalculate(date, 9);
            const newData = {
                name: name.name,
                created_at: Kdate,
                price: data.price,
                auctionId: auction_id,
                address: address,
            };
            console.log(newData);

            console.log("newData", newData);

            return Object.assign({
                statusCode: 200,
                success: true,
                statusMsg: `제안을 성공습니다.`,
            });
        } catch (error) {
            throw new BadRequestException(error.message);
        }
    }

    async findAllOffer(address: string, auction_id: number) {
        try {
            console.log(address, auction_id);
            if (address == `"NOT DEFINED"`) {
                console.log("로그인 한 유저가 없습니다..");
                address = undefined;
            }
            const offers = await this.offerRepository.query(`
                SELECT offer.price, offer.created_at, offer.auctionId, offer.address, user.name  
                FROM offer
                    INNER JOIN auction
                    ON offer.auctionId = auction.id
                    INNER JOIN user
                    ON offer.address = user.address
                WHERE offer.auctionId = ${auction_id}
                ORDER BY created_at ASC
            `);
            offers.forEach((element) => {
                const Kdate = parse_Kcalculate(element.created_at, 9);
                element.created_at = Kdate;
            });

            return Object.assign({
                statusCode: 200,
                success: true,
                statusMsg: `경매내역을 가져왔습니다.`,
                data: offers,
            });
        } catch (error) {
            throw new BadRequestException(error.message);
        }
    }

    async joinRoom(data, clientId) {
        return "hello";
    }
}
