import { Users } from "src/users/entities/user.entity";
import { UsersModule } from "src/users/users.module";
import {
    Column,
    CreateDateColumn,
    Entity,
    ManyToOne,
    OneToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from "typeorm";
import { Auction } from "./auction.entity";

@Entity()
export class Offer {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    biddingPrice: number;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @OneToOne((type) => Auction, (auction) => auction.offer)
    auction: Auction;

    @ManyToOne((type) => Users, (user) => user.offer)
    user: UsersModule;
}
