import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class UploadImage {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    originalName: string;

    @Column()
    encoding: string;

    @Column()
    mimeType: string;

    @Column()
    url: string;

    @CreateDateColumn()
    createdAt: Date;

    // @UpdateDateColumn()
    // updatedAt: Date;
}
