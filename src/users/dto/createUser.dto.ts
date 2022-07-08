import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";
export class CreateUserDto {
    @IsNotEmpty()
    @ApiProperty({
        example: "sadangdong",
        description: "유저 닉네임",
    })
    nickname: string;

    password: string;

    @ApiProperty({
        example: "저는 사당동 입니다.",
        description: "유저 설명",
    })
    description: string;

    @ApiProperty({
        example: "sadangdong.jpg",
        description: "유저 프로필 사진",
    })
    profileImage: string;

    @ApiProperty({
        example: "sadangdong.jpg",
        description: "유저 배너 사진",
    })
    bannerImage: string;
}
