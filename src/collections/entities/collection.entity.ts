import { Item } from "src/items/entities/item.entity";
import { Users } from "src/users/entities/user.entity";
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

@Entity({ schema: "sadangdong", name: "collection" })
export class Collection {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ name: "name", unique: true, nullable: true })
    name: string;

    @Column({ nullable: true })
    description: string;

    @Column({ nullable: true })
    earning: number;

    @Column({ nullable: true })
    bennerImage: string;

    @Column({ nullable: true })
    featureImage: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    // @Column("int", { name: "ownerId", nullable: true })
    // ownerId: number | null;

    @Column({ nullable: true })
    userId: number;

    @ManyToOne((type) => Users, (user) => user.collection, { onDelete: "SET NULL", onUpdate: "CASCADE" })
    // @JoinColumn()
    user: Users;

    @OneToMany((type) => Item, (item) => item.collection)
    item: Item[];
}
