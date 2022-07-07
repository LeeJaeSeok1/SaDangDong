import { User } from "src/users/entities/user.entity";
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
export class Chat {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    message: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @OneToOne((type) => Auction, (auction) => auction.chat)
    auction: Auction;

    @ManyToOne((type) => User, (user) => user.chat)
    user: User;
}
