import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class CreateItemDto {
    @IsNotEmpty()
    @ApiProperty({
        example: "0x96979DB0cAFa9Cd32F388AF06cb54d620797F409",
        description: "NFTtoken",
    })
    NFTtoken: string;

    @IsNotEmpty()
    @ApiProperty({
        example: "sadangdong",
        description: "아이템 이름",
    })
    name: string;

    @ApiProperty({
        example: "이아이템은 sadangdong 입니다.",
        description: "아이템 설명",
    })
    description: string;

    @ApiProperty({
        example: "ETH",
        description: "블록체인 종류",
    })
    Blockchain: string;
}
