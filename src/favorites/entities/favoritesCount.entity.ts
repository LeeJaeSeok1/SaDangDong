import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class FavolitesCount {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ comment: "아이템 토큰 값" })
    item_id: string;

    @Column()
    favoritesCount: number;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;

    // @OneToOne((type) => Item, (item) => item.like_relation)
    // // @JoinColumn({ name: "like_relation" })
    // item: Item;
}