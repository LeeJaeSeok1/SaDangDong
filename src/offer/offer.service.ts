import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, TreeRepository } from "typeorm";
import { Auction } from "src/auctions/entities/auction.entity";
import { Bidding } from "src/offer/entities/bidding.entity";
import { Offer } from "./entities/offer.entity";
import { User } from "src/users/entities/user.entity";

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

    async createOffer(address, data, auction_id) {
        try {
            const [[auction], [bidding]] = await Promise.all([
                this.auctionRepository.query(`
                SELECT *
                FROM auction
                WHERE id = ${auction_id}
                `),
                this.biddingRepository.query(`
                SELECT *
                FROM bidding
                WHERE id = ${auction_id}
                `),
            ]);
            if (!auction) {
                return "없는 경매입니다.";
            }
            if (bidding.price >= data.price) {
                return "현재 최고가보다 작습니다.";
            }
            const price = await this.biddingRepository.query(`
            SELECT bidding.*
            FROM bidding, auction
            WHERE auction.progress = true
            WHERE auction.id = bidding.auction_id
            WHERE Bidding.address = ${address}
            `);
            let total = data.price;
            for (let i = 0; i < price.length; i++) {
                total += price[i].price;
            }

            if (total > data.mycoin) {
                return "현재 지갑의 보유량보다 경매에 참여한 보유량이 더 많습니다.";
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
            return { bidding, newOffer };
        } catch (error) {}
    }

    async findAllOffer(address, auction_id) {
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
    }

    async joinRoom(data, clientId) {
        return "hello";
    }
}
