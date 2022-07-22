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
export class Favorites {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ default: false })
    isFavorites: boolean;

    @Column({ comment: "유저 아이디" })
    address: string;

    @Column({ nullable: true, comment: "아이템 토큰 값" })
    token_id: string;

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
