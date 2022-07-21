import { Auction } from "src/auctions/entities/auction.entity";
import { Collection } from "src/collections/entities/collection.entity";
import { IsLike } from "src/like/entities/like.entity";
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

    @Column({ unique: true })
    name: string;

    @Column({ nullable: true })
    description: string;

    @Column({ nullable: true })
    Blockchain: string;

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
    // @ManyToOne((type) => User, (user) => user.item)
    // // @JoinColumn({ name: "owner" })
    // user: User;

    @Column()
    collection_id: string;
    // @ManyToOne((type) => Collection, (collection) => collection.item)
    // // @JoinColumn({ name: "token_id" })
    // collection: Collection;

    // @OneToOne((type) => Auction, (auction) => auction.item)
    // auction: Auction;

    // @OneToOne((type) => Like, (like) => like.item)
    // like: Like;

    // @OneToOne((type) => Like_relation, (like_relation) => like_relation.item)
    // like_relation: Like_relation;
}
