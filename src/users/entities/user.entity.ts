import { isNotEmpty } from "class-validator";
import { Chat } from "src/auctions/entities/chat.entity";
import { Offer } from "src/auctions/entities/offer.entity";
import { Collection } from "src/collections/entities/collection.entity";
import { Item } from "src/items/entities/item.entity";
import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class Users {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    walletId: string;

    @Column({ nullable: true, default: "unnamed" })
    nickname: string;

    @Column({ nullable: true })
    description: string;

    @Column({ nullable: true, default: "https://sadangdong99.s3.ap-northeast-2.amazonaws.com/1657871846145-image.png" })
    profileImage: string;

    @Column({ nullable: true })
    bannerImage: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @OneToMany((type) => Collection, (collection) => collection.user, { eager: true })
    collection: Collection[];

    @OneToMany((type) => Item, (item) => item.user, { eager: true })
    item: Item[];

    @OneToMany((type) => Offer, (offer) => offer.user)
    offer: Offer;

    @OneToMany((type) => Chat, (chat) => chat.user)
    chat: Chat;
}
