import { Module } from "@nestjs/common";
import { ItemsService } from "./items.service";
import { ItemsController } from "./items.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Item } from "./entities/item.entity";
import { Collection } from "src/collections/entities/collection.entity";
import { User } from "src/users/entities/user.entity";
import { Favorites_Relation } from "src/favorites/entities/favorites_relation.entity";
import { Auction } from "src/auctions/entities/auction.entity";
import { Offer } from "src/offer/entities/offer.entity";
import { Bidding } from "src/offer/entities/bidding.entity";

@Module({
    imports: [TypeOrmModule.forFeature([Item, Collection, User, Favorites_Relation, Auction, Offer, Bidding])],
    exports: [TypeOrmModule],
    controllers: [ItemsController],
    providers: [ItemsService],
})
export class ItemsModule {}
