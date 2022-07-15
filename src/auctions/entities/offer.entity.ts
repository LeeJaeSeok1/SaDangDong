import { User } from "src/users/entities/user.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Auction } from "./auction.entity";

@Entity()
export class Offer {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    price: number;

    @CreateDateColumn()
    created_at: Date;

    @OneToOne((type) => Auction, (auction) => auction.offer)
    @JoinColumn()
    auction: Auction;

    @ManyToMany((type) => User, (user) => user.offer)
    user: User[];
}
