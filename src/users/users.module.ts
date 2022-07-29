import { Module } from "@nestjs/common";
import { UsersService } from "./users.service";
import { UsersController } from "./users.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "./entities/user.entity";
import { Collection } from "src/collections/entities/collection.entity";
import { Item } from "src/items/entities/item.entity";
import { ImageUpload } from "src/images/entities/image.entity";
import { Favorites } from "src/favorites/entities/favorites.entity";
import { Auction } from "src/auctions/entities/auction.entity";
import { Bidding } from "src/offer/entities/bidding.entity";
import { Favorites_Relation } from "src/favorites/entities/favorites_relation.entity";

@Module({
    imports: [
        TypeOrmModule.forFeature([
            User,
            Collection,
            Item,
            ImageUpload,
            Favorites,
            Auction,
            Bidding,
            Favorites_Relation,
        ]),
    ],
    exports: [TypeOrmModule],
    controllers: [UsersController],
    providers: [UsersService],
})
export class UsersModule {}
