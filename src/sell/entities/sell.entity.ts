import { Auction } from "src/auctions/entities/auction.entity";
import { User } from "src/users/entities/user.entity";
import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Sell extends Auction {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    count: number;

    @Column()
    start_at: Date;

    @Column()
    end_at: Date;

    @OneToOne((type) => User, (user) => user.sell)
    @JoinColumn()
    user: User;
}
