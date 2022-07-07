import { User } from "src/users/entities/user.entity";
import {
    Column,
    CreateDateColumn,
    Entity,
    ManyToOne,
    PrimaryColumn,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from "typeorm";

@Entity()
export class Collection {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name1: string;

    @Column()
    description: string;

    @Column()
    earning: number;

    @Column()
    bennerImage: string;

    @Column()
    logoImge: string;

    @Column()
    fearureImage: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @ManyToOne((type) => User, (user) => user.collection)
    user: User;
}
