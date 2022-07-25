import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { SellService } from "./sell.service";
import { SellController } from "./sell.controller";
import { Auction } from "src/auctions/entities/auction.entity";
import { Item } from "src/items/entities/item.entity";
import { Bidding } from "src/offer/entities/bidding.entity";
import { Offer } from "src/offer/entities/offer.entity";
import { User } from "src/users/entities/user.entity";
import { Sell } from "./entities/sell.entity";

@Module({
    imports: [TypeOrmModule.forFeature([Offer, Bidding, Auction, User, Item, Sell])],
    exports: [TypeOrmModule],
    controllers: [SellController],
    providers: [SellService],
})
export class SellModule {}
