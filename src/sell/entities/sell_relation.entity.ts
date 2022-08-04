import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Sell_Relation {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    count: number;

    @Column()
    start_at: Date;

    @Column()
    end_at: Date;

    @Column()
    address: string;
}
