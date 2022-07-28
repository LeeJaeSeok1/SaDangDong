import { Module } from "@nestjs/common";
import { ExploreService } from "./explore.service";
import { ExploreController } from "./explore.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Collection } from "src/collections/entities/collection.entity";
import { Item } from "src/items/entities/item.entity";
import { Auction } from "src/auctions/entities/auction.entity";
import { User } from "src/users/entities/user.entity";
import { Favorites_Relation } from "src/favorites/entities/favorites_relation.entity";
import { Favorites } from "src/favorites/entities/favorites.entity";
import { Sell } from "src/sell/entities/sell.entity";
import { Bidding } from "src/offer/entities/bidding.entity";

@Module({
    imports: [
        TypeOrmModule.forFeature([Collection, Item, Auction, User, Favorites_Relation, Favorites, Sell, Bidding]),
    ],
    controllers: [ExploreController],
    providers: [ExploreService],
})
export class ExploreModule {}
