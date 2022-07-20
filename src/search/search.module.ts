import { Module } from "@nestjs/common";
import { SearchService } from "./search.service";
import { SearchController } from "./search.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Collection } from "src/collections/entities/collection.entity";
import { Item } from "src/items/entities/item.entity";
import { Auction } from "src/auctions/entities/auction.entity";

@Module({
    imports: [TypeOrmModule.forFeature([Collection, Item, Auction])],
    controllers: [SearchController],
    providers: [SearchService],
})
export class SearchModule {}
