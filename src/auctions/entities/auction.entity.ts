import { Item } from "src/items/entities/item.entity";
import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Chat } from "./chat.entity";
import { Offer } from "./offer.entity";

@Entity()
export class Auction {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    price: number;

    @Column()
    start_at: Date;

    @Column()
    end_at: Date;

    @OneToOne((type) => Item, (item) => item.auction)
    @JoinColumn()
    item: Item;

    @OneToOne((type) => Offer, (offer) => offer.auction)
    offer: Offer;

    @OneToOne((type) => Chat, (chat) => chat.auction)
    chat: Chat;
}
