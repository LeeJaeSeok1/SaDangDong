import { Auction } from "src/auctions/entities/auction.entity";
import { Collection } from "src/collections/entities/collection.entity";
import { Like, Like_relation } from "src/like/entities/like.entity";
import { User } from "src/users/entities/user.entity";
import {
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity,
    ManyToOne,
    OneToOne,
    PrimaryColumn,
    UpdateDateColumn,
} from "typeorm";

@Entity()
export class Item {
    @PrimaryColumn()
    token_id: string;

    @Column()
    name: string;

    @Column({ nullable: true })
    description: string;

    @Column()
    supply: number;

    @Column()
    Blockchain: string;

    @Column({ name: "producer", comment: "제작자" })
    address: string;

    @Column()
    image: string;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;

    @Column({ comment: "삭제여부 0 or 1" })
    archived: number;

    @DeleteDateColumn()
    archived_at: Date;

    // @Column()
    // owner: string;
    // @ManyToOne((type) => User, (user) => user.item)
    // // @JoinColumn({ name: "owner" })
    // user: User;

    // @OneToOne((type) => Auction, (auction) => auction.item)
    // // @JoinColumn({ name: "token_id" })
    // auction: Auction;

    // @Column()
    // collection_id: number;
    // @ManyToOne((type) => Collection, (collection) => collection.item)
    // // @JoinColumn({ name: "token_id" })
    // collection: Collection;

    // @OneToOne((type) => Like, (like) => like.item)
    // like: Like;

    // @OneToOne((type) => Like_relation, (like_relation) => like_relation.item)
    // like_relation: Like_relation;
}
