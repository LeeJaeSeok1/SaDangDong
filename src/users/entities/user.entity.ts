import { Chat } from "src/auctions/entities/chat.entity";
import { Offer } from "src/auctions/entities/offer.entity";
import { Collection } from "src/collections/entities/collection.entity";
import { Item } from "src/items/entities/item.entity";
import {
    Column,
    CreateDateColumn,
    Entity,
    OneToMany,
    PrimaryColumn,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from "typeorm";

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @PrimaryColumn()
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

    @OneToMany((type) => Collection, (collection) => collection.user)
    collection: Collection;

    @OneToMany((type) => Item, (item) => item.user)
    item: Item;

    @OneToMany((type) => Offer, (offer) => offer.user)
    offer: Offer;

    @OneToMany((type) => Chat, (chat) => chat.user)
    chat: Chat;
}
