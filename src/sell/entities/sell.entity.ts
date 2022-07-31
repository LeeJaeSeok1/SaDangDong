import {
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    OneToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from "typeorm";

@Entity()
export class Sell {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    auction_id: number;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;

    @Column()
    to_address: string;

    @Column()
    from_address: string;

    @Column({ type: "decimal", precision: 7, scale: 4, default: 0 })
    price: number;

    @Column()
    token_id: number;
}
