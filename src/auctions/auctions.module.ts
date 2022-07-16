import { Module } from "@nestjs/common";
import { AuctionsService } from "./auctions.service";
import { AuctionsController } from "./auctions.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "src/users/entities/user.entity";
import { Item } from "src/items/entities/item.entity";
import { Auction } from "./entities/auction.entity";

@Module({
    imports: [TypeOrmModule.forFeature([Auction, User, Item])],
    exports: [TypeOrmModule],
    controllers: [AuctionsController],
    providers: [AuctionsService],
})
export class AuctionsModule {}
