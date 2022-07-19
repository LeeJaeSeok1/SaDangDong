import { Item } from "src/items/entities/item.entity";
import { User } from "src/users/entities/user.entity";
import {
    Column,
    CreateDateColumn,
    Entity,
    OneToMany,
    ManyToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
    JoinColumn,
} from "typeorm";

@Entity()
export class Collection {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    name: string;

    @Column({ nullable: true })
    description: string;

    @Column({ type: "decimal", precision: 7, scale: 4, default: 0 })
    commission: number;

    @Column({ nullable: true })
    benner_image: string;

    @Column({ nullable: true })
    feature_image: string;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;

    @Column({ nullable: true })
    address: string;

    // @ManyToOne((type) => User, (user) => user.collection, { onDelete: "SET NULL", onUpdate: "CASCADE" })
    // user: User;

    // @OneToMany((type) => Item, (item) => item.collection)
    // item: Item[];
}
