import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class CreateAuctionDto {
    @IsNotEmpty()
    @ApiProperty({
        example: "1 ETH",
        description: "경매 시작가",
    })
    price: number;

    @ApiProperty({
        example: "1.5 ETH",
        description: "입찰가 제안 = 현제 입찰가 + n%",
    })
    biddingPrice: number;
}
