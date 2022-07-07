import { Item } from "src/items/entities/item.entity";
import { Column, CreateDateColumn, Entity, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Chat } from "./chat.entity";
import { Offer } from "./offer.entity";

@Entity()
export class Auction {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    price: number;

    @Column()
    biddingPrice: number;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @OneToOne((type) => Item, (item) => item.auction)
    item: Item;

    @OneToOne((type) => Offer, (offer) => offer.auction)
    offer: Offer;

    @OneToOne((type) => Chat, (chat) => chat.auction)
    chat: Chat;
}
