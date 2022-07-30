import { isNotEmpty } from "class-validator";
import { Collection } from "src/collections/entities/collection.entity";
import { Item } from "src/items/entities/item.entity";
import {
    Column,
    CreateDateColumn,
    Entity,
    ManyToMany,
    OneToMany,
    OneToOne,
    PrimaryColumn,
    UpdateDateColumn,
} from "typeorm";

@Entity()
export class User {
    @PrimaryColumn({ unique: true })
    address: string;

    @Column({ unique: true })
    name: string;

    @Column({
        nullable: true,
        default: "https://sadangdong99.s3.ap-northeast-2.amazonaws.com/1657871846145-image.png",
    })
    profile_image: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
