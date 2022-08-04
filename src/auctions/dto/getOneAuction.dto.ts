import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class getOneAuctionDto {
    price: number;
    token_id: string;
    ended_at: Date;
    collection_name: string;
    owner: string;
    name: string;
    description: string;
    address: string;
}
