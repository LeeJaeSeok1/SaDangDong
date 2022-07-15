import { User } from "src/users/entities/user.entity";
import { Column, CreateDateColumn, Entity, ManyToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Auction } from "./auction.entity";

@Entity()
export class Chat {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    message: string;

    @CreateDateColumn()
    createdAt: Date;

    @OneToOne((type) => Auction, (auction) => auction.chat)
    auction: Auction;

    @ManyToMany((type) => User, (user) => user.chat)
    user: User[];
}
