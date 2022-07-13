import { Auction } from "src/auctions/entities/auction.entity";
import { Collection } from "src/collections/entities/collection.entity";
import { Users } from "src/users/entities/user.entity";
import {
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    OneToOne,
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

    @Column()
    userId: number;
    @ManyToOne((type) => Users, (user) => user.item)
    @JoinColumn()
    user: Users;

    @OneToOne((type) => Auction, (auction) => auction.item)
    auction: Auction;

    @Column()
    collectionId: number;
    @ManyToOne((type) => Collection, (collection) => collection.item)
    @JoinColumn()
    collection: Collection[];
}
