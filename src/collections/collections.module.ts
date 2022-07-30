import { Module } from "@nestjs/common";
import { CollectionsController } from "./collections.controller";
import { CollectionsService } from "./collections.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Collection } from "./entities/collection.entity";
import { User } from "src/users/entities/user.entity";
import { Item } from "src/items/entities/item.entity";
import { Auction } from "src/auctions/entities/auction.entity";
import { Favorites_Relation } from "src/favorites/entities/favorites_relation.entity";
import { Favorites } from "src/favorites/entities/favorites.entity";
import { Sell_Relation } from "src/sell/entities/sell_relation.entity";
import { Bidding } from "src/offer/entities/bidding.entity";

@Module({
    imports: [
        TypeOrmModule.forFeature([
            Collection,
            Item,
            Auction,
            User,
            Favorites_Relation,
            Favorites,
            Sell_Relation,
            Bidding,
        ]),
    ],
    exports: [TypeOrmModule],
    controllers: [CollectionsController],
    providers: [CollectionsService],
})
export class CollectionsModule {}
