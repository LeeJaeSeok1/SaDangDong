import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Offer } from "./entities/offer.entity";
import { Bidding } from "./entities/bidding.entity";
import { OfferGateway } from "./offer.gateway";
import { Auction } from "src/auctions/entities/auction.entity";
import { OfferService } from "./offer.service";
import { User } from "src/users/entities/user.entity";

@Module({
    imports: [TypeOrmModule.forFeature([Offer, Bidding, Auction, User])],
    exports: [TypeOrmModule],
    controllers: [],
    providers: [OfferGateway, OfferService],
})
export class OfferModule {}
