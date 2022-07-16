import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class CreateAuctionDto {
    @IsNotEmpty()
    @ApiProperty({
        example: 1,
        description: "경매 시작가",
    })
    price: number;
}
