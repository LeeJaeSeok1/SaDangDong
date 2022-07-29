import { Module } from "@nestjs/common";
import { ScheduleModule } from "@nestjs/schedule";
import { TaskService } from "./task.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Collection } from "src/collections/entities/collection.entity";
import { Item } from "src/items/entities/item.entity";
import { Auction } from "src/auctions/entities/auction.entity";
import { User } from "src/users/entities/user.entity";
import { Favorites_Relation } from "src/favorites/entities/favorites_relation.entity";
import { Favorites } from "src/favorites/entities/favorites.entity";
import { Sell } from "src/sell/entities/sell.entity";
import { Bidding } from "src/offer/entities/bidding.entity";
import { TaskController } from "./task.controller";

@Module({
    imports: [
        ScheduleModule.forRoot(),
        TypeOrmModule.forFeature([Collection, Item, Auction, User, Favorites_Relation, Favorites, Sell, Bidding]),
    ],
    controllers: [TaskController],
    providers: [TaskService],
})
export class TaskModule {}
