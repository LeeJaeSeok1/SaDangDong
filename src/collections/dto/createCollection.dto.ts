import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class CreateCollectionDto {
    @IsNotEmpty()
    @ApiProperty({
        example: "sadangdongCollection",
        description: "컬렉션 이름",
    })
    name: string;

    @ApiProperty({
        example: "sadangdong컬렉션에 오신걸 환연합니다.",
        description: "컬렉션 설명",
    })
    description: string;

    @ApiProperty({
        example: "0.5",
        description: "아이템 판매 수수료",
    })
    earning: number;

    @ApiProperty({
        example: "sadangdong.jpg",
        description: "컬렉션 베너 사진",
    })
    bennerImage: string;

    @ApiProperty({
        example: "sadangdong.jpg",
        description: "컬렉션 매인 사진",
    })
    fearureImage: string;
}
