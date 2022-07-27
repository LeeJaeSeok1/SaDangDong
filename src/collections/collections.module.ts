import { Module } from "@nestjs/common";
import { CollectionsController } from "./collections.controller";
import { CollectionsService } from "./collections.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Collection } from "./entities/collection.entity";
import { User } from "src/users/entities/user.entity";
import { Item } from "src/items/entities/item.entity";
import { Auction } from "src/auctions/entities/auction.entity";

@Module({
    imports: [TypeOrmModule.forFeature([Collection, User, Item, Auction])],
    exports: [TypeOrmModule],
    controllers: [CollectionsController],
    providers: [CollectionsService],
})
export class CollectionsModule {}
