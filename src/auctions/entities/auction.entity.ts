import { Item } from "src/items/entities/item.entity";
import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Auction {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: "decimal", precision: 7, scale: 4, default: 0 })
    price: number;

    @Column()
    token_id: string;

    @Column()
    started_at: Date;

    @Column()
    ended_at: Date;

    @Column()
    progress: boolean;

    // @OneToOne((type) => Item, (item) => item.auction)
    // @JoinColumn()
    // item: Item;

    // @OneToOne((type) => Offer, (offer) => offer.auction)
    // offer: Offer;

    // @OneToOne((type) => Chat, (chat) => chat.auction)
    // chat: Chat;
}
