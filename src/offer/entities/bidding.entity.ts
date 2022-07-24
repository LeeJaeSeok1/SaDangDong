import {
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity,
    PrimaryColumn,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from "typeorm";

// @Entity()
export class Bidding {
    @PrimaryGeneratedColumn()
    id: number;
    // primary key _id

    @Column({ type: "decimal", precision: 7, scale: 4, default: 0 })
    price: number;
    // price 최고가

    @Column()
    address: string;
    // 최고가 제안자 address

    @Column()
    auctionId: number;
    // auctionId
}
