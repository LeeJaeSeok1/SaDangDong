import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, TreeRepository } from "typeorm";
import { Auction } from "src/auctions/entities/auction.entity";
import { Bidding } from "src/offer/entities/bidding.entity";
import { Offer } from "./entities/offer.entity";

@Injectable()
export class OfferService {
    constructor(
        @InjectRepository(Auction)
        private auctionRepository: Repository<Auction>,
        @InjectRepository(Bidding)
        private biddingRepository: Repository<Bidding>,
        @InjectRepository(Offer)
        private offerRepository: Repository<Offer>,
    ) {}

    indentify(name: string, clientId: string) {
        try {
        } catch (error) {}
        return clientId;
    }

    getClientName(clientId: string) {
        try {
        } catch (error) {}
        return clientId;
    }

    async createOffer(price, address, auction_id) {
        try {
            const [auction, bidding] = await Promise.all([
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
            ]);
            if (!auction) {
                return "없는 경매입니다.";
            }
            if (bidding.price >= price) {
                return "현재 최고가보다 작습니다.";
            }

            const newOffer = new Offer();
            newOffer.price = price;
            newOffer.auctionId = auction_id;
            newOffer.address = address;

            bidding.price = price;
            bidding.address = address;

            await Promise.all([this.offerRepository.save(newOffer), this.biddingRepository.save(bidding)]);
            return { bidding, newOffer };
        } catch (error) {}
    }

    async findAllOffer(address, auction_id) {
        console.log(address, auction_id);
        const [auction, bidding, offer] = await Promise.all([
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

        return { auction, bidding, offer };
    }
}
