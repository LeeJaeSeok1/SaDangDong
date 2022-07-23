import { Column, CreateDateColumn, DeleteDateColumn, Entity, PrimaryColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class Bidding {}
// primary key _id
// price 최고가
// address 최고가 제안자
// auctionId
