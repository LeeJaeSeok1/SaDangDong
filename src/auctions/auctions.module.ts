import { Module } from "@nestjs/common";
import { AuctionsService } from "./auctions.service";
import { AuctionsController } from "./auctions.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { PassportModule } from "@nestjs/passport";
import { Users } from "src/users/entities/user.entity";
import { Item } from "src/items/entities/item.entity";
import { Auction } from "./entities/auction.entity";

@Module({
    imports: [TypeOrmModule.forFeature([Auction, Users, Item]), PassportModule.register({ defaultStrategy: "jwt" })],
    exports: [TypeOrmModule],
    controllers: [AuctionsController],
    providers: [AuctionsService],
})
export class AuctionsModule {}
