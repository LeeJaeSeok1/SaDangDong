import { Auction } from "src/auctions/entities/auction.entity";
import { Collection } from "src/collections/entities/collection.entity";
import { User } from "src/users/entities/user.entity";
import {
    Column,
    CreateDateColumn,
    Entity,
    ManyToMany,
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

    @Column()
    NFTtoken: string;

    @Column()
    name: string;

    @Column()
    owner: string;

    @Column()
    description: string;

    @Column()
    Blockchain: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @ManyToOne((type) => User, (user) => user.item)
    user: User;

    @OneToOne((type) => Auction, (auction) => auction.item)
    auction: Auction;

    @ManyToOne((type) => Collection, (collection) => collection.item)
    collection: Collection[];
}
