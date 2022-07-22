import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class Favorites_Relation {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ comment: "아이템 토큰 값" })
    token_id: string;

    @Column()
    count: number;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;

    // @OneToOne((type) => Item, (item) => item.like_relation)
    // // @JoinColumn({ name: "like_relation" })
    // item: Item;
}
