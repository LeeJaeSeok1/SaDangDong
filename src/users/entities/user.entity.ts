import { isNotEmpty } from "class-validator";
import { Chat } from "src/auctions/entities/chat.entity";
import { Offer } from "src/auctions/entities/offer.entity";
import { Collection } from "src/collections/entities/collection.entity";
import { Item } from "src/items/entities/item.entity";
import { Sell } from "src/sell/entities/sell.entity";
import {
    Column,
    CreateDateColumn,
    Entity,
    ManyToMany,
    OneToMany,
    OneToOne,
    PrimaryColumn,
    UpdateDateColumn,
} from "typeorm";

@Entity()
export class User {
    @PrimaryColumn({ unique: true })
    address: string;

    @Column({ nullable: true, default: "unnamed" })
    name: string;

    @Column({
        nullable: true,
        default: "https://sadangdong99.s3.ap-northeast-2.amazonaws.com/1657871846145-image.png",
    })
    profile_image: string;

    @Column({ nullable: true })
    banner_image: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    // @OneToMany((type) => Collection, (collection) => collection.user, { eager: true })
    // collection: Collection[];

    // @OneToMany((type) => Item, (item) => item.user, { eager: true })
    // item: Item[];

    // @OneToOne((type) => Sell, (sell) => sell.user)
    // sell: Sell;

    // @OneToMany((type) => Like, (like) => like.user)
    // like: Like;

    // @ManyToMany((type) => Offer, (offer) => offer.user)
    // offer: Offer[];

    // @ManyToMany((type) => Chat, (chat) => chat.user)
    // chat: Chat[];
}
