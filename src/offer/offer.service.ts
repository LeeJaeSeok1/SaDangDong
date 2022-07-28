import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Auction } from "src/auctions/entities/auction.entity";
import { Bidding } from "src/offer/entities/bidding.entity";
import { Offer } from "./entities/offer.entity";
import { User } from "src/users/entities/user.entity";
import { CreateOfferDto } from "./dto/createoffer.dto";

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

    indentify(auction_id: string, clientId: string) {
        try {
            return clientId;
        } catch (error) {}
    }

    async createOffer(data: CreateOfferDto) {
        try {
            console.log(data);
            data.price = Number(data.price);
            data.mycoin = Number(data.mycoin);
            console.log(1);
            const [[auction], [bidding]] = await Promise.all([
                this.auctionRepository.query(`
                SELECT *
                FROM auction
                WHERE id = ${data.auction_id}
                `),
                this.biddingRepository.query(`
                SELECT *
                FROM bidding
                WHERE auctionId = ${data.auction_id}
                `),
            ]);
            console.log(2);
            if (!auction) {
                return "없는 경매입니다.";
            }
            console.log(3);

            console.log(data.price);
            console.log(bidding.price);
            console.log(typeof data.price);

            if (bidding.price >= data.price) {
                return "현재 최고가보다 작습니다.";
            }
            console.log(4);
            const totalbidding = await this.biddingRepository.query(`
            SELECT bidding.*
            FROM bidding, auction
            WHERE auction.progress = true
            AND auction.id = bidding.auctionId
            AND bidding.address = "${data.address}"
            `);
            console.log(5);
            let total: number = data.price;
            for (let i = 0; i < totalbidding.length; i++) {
                total += totalbidding[i].price;
            }
            console.log(6);
            console.log(total);
            console.log(typeof total);
            console.log(typeof bidding.price);

            if (total > data.mycoin) {
                return "현재 지갑의 보유량보다 경매에 참여한 보유량이 더 많습니다.";
            }
            console.log(7);

            const newOffer = new Offer();
            newOffer.price = data.price;
            newOffer.auctionId = data.auction_id;
            newOffer.address = data.address;

            bidding.price = data.price;
            bidding.address = data.address;
            console.log(8);
            await Promise.all([
                this.offerRepository.save(newOffer),
                this.biddingRepository.update(bidding.id, bidding),
            ]);
            console.log(9);
            const newData = { bidding, address: data.address };
            return newData;
        } catch (error) {
            throw new BadRequestException(error.message);
        }
    }

    async findAllOffer(address, auction_id) {
        try {
            console.log(address, auction_id);
            const [[auction], [bidding], offer] = await Promise.all([
                this.auctionRepository.query(`
                SELECT *
                FROM auction
                WHERE id = ${auction_id}
                `),
                this.biddingRepository.query(`
                SELECT *
                FROM Bidding
                WHERE id = ${auction_id}
                `),
                this.offerRepository.query(`
                SELECT *
                FROM Offer
                WHERE auctionId = ${auction_id}
                `),
            ]);
            if (!auction) {
                return "없는 경매입니다.";
            }

            return { auction, bidding, data: offer };
        } catch (error) {
            throw new BadRequestException(error.message);
        }
    }

    async joinRoom(data, clientId) {
        return "hello";
    }
}
