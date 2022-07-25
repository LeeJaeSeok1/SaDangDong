import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Sell {
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

    // @OneToOne((type) => User, (user) => user.sell)
    // // @JoinColumn({ name: "sell_id" })
    // user: User;
}
