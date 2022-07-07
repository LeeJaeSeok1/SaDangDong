import { Auction } from "src/auctions/entities/auction.entity";
import { Favorite, FavoriteCount } from "src/favorites/entities/favorite.entity";
import { User } from "src/users/entities/user.entity";
import {
    Column,
    CreateDateColumn,
    Entity,
    ManyToOne,
    OneToOne,
    PrimaryColumn,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from "typeorm";

@Entity()
export class Item {
    @PrimaryGeneratedColumn()
    id: number;

    @PrimaryColumn()
    name: string;

    @Column()
    nickname: string;

    @Column()
    description: string;

    @Column()
    profileImage: string;

    @Column()
    bannerImage: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @ManyToOne((type) => User, (user) => user.item)
    user: User;

    @OneToOne((type) => Auction, (auction) => auction.item)
    auction: Auction;
}
