import {
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    OneToOne,
    PrimaryColumn,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from "typeorm";

@Entity()
export class Ethereum {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    address: string;

    @Column()
    get_at: Date;
}
