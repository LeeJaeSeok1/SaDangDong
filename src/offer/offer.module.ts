import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Offer } from "./entities/offer.entity";
import { Bidding } from "./entities/bidding.entity";
import { OfferGateway } from "./offer.gateway";
import { Auction } from "src/auctions/entities/auction.entity";
import { OfferService } from "./offer.service";
import { User } from "src/users/entities/user.entity";
import { OfferController } from "./offer.controller";

@Module({
    imports: [TypeOrmModule.forFeature([Offer, Bidding, Auction, User])],
    exports: [TypeOrmModule],
    controllers: [OfferController],
    providers: [OfferService, OfferGateway],
})
export class OfferModule {}
