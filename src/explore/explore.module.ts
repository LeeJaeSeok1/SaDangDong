import { Module } from "@nestjs/common";
import { ExploreService } from "./explore.service";
import { ExploreController } from "./explore.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Collection } from "src/collections/entities/collection.entity";
import { Item } from "src/items/entities/item.entity";
import { Auction } from "src/auctions/entities/auction.entity";
import { User } from "src/users/entities/user.entity";

@Module({
    imports: [TypeOrmModule.forFeature([Collection, Item, Auction, User])],
    controllers: [ExploreController],
    providers: [ExploreService],
})
export class ExploreModule {}
