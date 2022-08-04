import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class ImageUpload {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ nullable: true })
    originalName: string;

    @Column({ nullable: true })
    mimeType: string;

    @Column({ nullable: true })
    url: string;

    @Column({ nullable: true })
    name: string;

    @Column({ nullable: true })
    description: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
