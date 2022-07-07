import { Auction } from "src/auctions/entities/auction.entity";
import { Column, Entity } from "typeorm";

@Entity()
export class Sell extends Auction {
    @Column()
    isSell: boolean;
}

@Entity()
export class SellCount extends Auction {
    @Column()
    sellCount: number;
}
