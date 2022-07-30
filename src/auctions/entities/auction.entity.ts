import { Item } from "src/items/entities/item.entity";
import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Auction {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: "decimal", precision: 7, scale: 4 })
    price: number;

    @Column()
    token_id: string;

    @Column()
    started_at: Date;

    @Column()
    ended_at: Date;

    @Column()
    transaction_at: Date;

    @Column()
    progress: boolean;

    @Column()
    transaction: boolean;
}
