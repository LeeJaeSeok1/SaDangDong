import { Item } from "src/items/entities/item.entity";
import { User } from "src/users/entities/user.entity";
import {
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    OneToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from "typeorm";

@Entity()
export class Like {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ default: false })
    isLike: boolean;

    @Column({ comment: "유저 아이디" })
    user_id: string;

    @Column({ comment: "아이템 토큰 값" })
    item_id: string;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;

    // @OneToOne((type) => Item, (item) => item.like)
    // // @JoinColumn({ name: "like_id" })
    // item: Item;

    // @ManyToOne((type) => User, (user) => user.like)
    // // @JoinColumn({ name: "like_id" })
    // user: User;
}

@Entity()
export class LikeCount {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ comment: "아이템 토큰 값" })
    item_id: string;

    @Column()
    likeCount: number;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;

    // @OneToOne((type) => Item, (item) => item.like_relation)
    // // @JoinColumn({ name: "like_relation" })
    // item: Item;
}
