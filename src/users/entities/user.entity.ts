import { Chat } from "src/auctions/entities/chat.entity";
import { Offer } from "src/auctions/entities/offer.entity";
import { Collection } from "src/collections/entities/collection.entity";
import { Item } from "src/items/entities/item.entity";
import {
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    OneToMany,
    OneToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from "typeorm";

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ nullable: true })
    nickname: string;

    @Column({ nullable: true })
    password: string;

    @Column({ nullable: true })
    description: string;

    @Column({ nullable: true })
    profileImage: string;

    @Column({ nullable: true })
    bannerImage: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @OneToMany((type) => Collection, (collection) => collection.owner)
    collection: Collection[];

    @OneToMany((type) => Item, (item) => item.user)
    item: Item[];

    @OneToMany((type) => Offer, (offer) => offer.user)
    offer: Offer;

    @OneToMany((type) => Chat, (chat) => chat.user)
    chat: Chat;
}
