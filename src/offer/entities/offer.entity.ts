import {
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity,
    PrimaryColumn,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from "typeorm";

@Entity()
export class Offer {
    @PrimaryGeneratedColumn()
    id: number;
    // primary key _id
    @Column({ type: "decimal", precision: 7, scale: 4, default: 0 })
    price: number;
    // price 제안가

    @CreateDateColumn()
    created_at: Date;
    // 제안 일자

    @Column()
    auctionId: number;
    // auctionId

    @Column()
    address: string;
    // 지갑 주소 address
}
