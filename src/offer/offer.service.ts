import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
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
        return clientId;
    }

    getClientName(clientId: string) {
        return clientId;
    }

    create() {
        return "This action adds a new sell";
    }

    findAll() {
        return `This action returns all sell`;
    }
}
