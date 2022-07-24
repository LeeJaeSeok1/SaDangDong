import { Module } from "@nestjs/common";
import { OfferGateway } from "./offer.gateway";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Offer } from "./entities/offer.entity";
import { Bidding } from "./entities/bidding.entity";
import { OfferController } from "./offer.controller";
import { Auction } from "src/auctions/entities/auction.entity";

@Module({
    imports: [TypeOrmModule.forFeature([Offer, Bidding, Auction])],
    exports: [TypeOrmModule],
    controllers: [OfferController],
    providers: [OfferGateway],
})
export class OfferModule {}
