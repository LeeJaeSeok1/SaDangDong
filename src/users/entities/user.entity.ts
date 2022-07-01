import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";


@Entity()
export class User {

    // @PrimaryGeneratedColumn()
    // walletId: number;

    @PrimaryGeneratedColumn()
    nickname: string;

    @Column()
    profileImage: string;

    @Column()
    bannerImage: string;
    
    @Column()
    description: string;
    
    // @Column()
    // block: string;
    @Column({ default: true })
    isActive: boolean;
}

