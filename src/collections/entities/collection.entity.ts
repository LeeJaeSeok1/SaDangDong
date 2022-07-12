import { Item } from "src/items/entities/item.entity";
import { User } from "src/users/entities/user.entity";
import {
    Column,
    CreateDateColumn,
    Entity,
    Index,
    OneToMany,
    ManyToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
    JoinColumn,
} from "typeorm";

@Index("name", ["name"], { unique: true })
@Index("bennerImage", { unique: true })
@Index("logoImage", { unique: true })
@Index("fearureImage", { unique: true })
@Index("ownerId", ["ownerId"], {})
@Entity({ schema: "sadangdong", name: "collection" })
export class Collection {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ name: "name", unique: true })
    name: string;

    @Column()
    description: string;

    @Column()
    earning: number;

    @Column({ name: "bennerImage", unique: true, nullable: true })
    bennerImage: string;

    @Column({ name: "logoImage", unique: true, nullable: true })
    logoImage: string;

    @Column({ name: "fearureImage", unique: true, nullable: true })
    fearureImage: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @Column("int", { name: "ownerId", nullable: true })
    ownerId: number | null;

    @ManyToOne((type) => User, (user) => user.collection)
    owner: User;

    @OneToMany((type) => Item, (item) => item.collection)
    item: Item[];
}
