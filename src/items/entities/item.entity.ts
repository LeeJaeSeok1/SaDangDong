import { Auction } from "src/auctions/entities/auction.entity";
import { Collection } from "src/collections/entities/collection.entity";
import { User } from "src/users/entities/user.entity";
import {
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    OneToOne,
    PrimaryColumn,
    UpdateDateColumn,
} from "typeorm";

@Entity()
export class Item {
    @PrimaryColumn({ unique: true })
    token_id: string;

    @Column({ nullable: true })
    name: string;

    @Column({ nullable: true })
    description: string;

    @Column({ comment: "제작자" })
    address: string;

    @Column({ nullable: true })
    image: string;

    @Column({ nullable: true })
    ipfsImage: string;

    @Column({ nullable: true })
    ipfsJson: string;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;

    @Column({ comment: "삭제여부 0 or 1", default: 0 })
    archived: number;

    @DeleteDateColumn()
    archived_at: Date;

    @Column()
    owner: string;

    @Column()
    hashdata: string;

    @Column()
    collection_name: string;
}
