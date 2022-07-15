import { PartialType } from "@nestjs/mapped-types";
import { ApiProperty } from "@nestjs/swagger";
import { CreateUserDto } from "./createUser.dto";

export class UpdateUserDto extends PartialType(CreateUserDto) {
    @ApiProperty({
        example: "https://sadangdong.com",
        description: "로고 이미지 URL",
    })
    logoImage: string;

    @ApiProperty({
        example: "https://sadangdong.com",
        description: "베너 이미지 RUL",
    })
    bennerImage: string;

    @ApiProperty({
        example: "sadangdong",
        description: "닉네임",
    })
    nickname: string;

    @ApiProperty({
        example: "나는 사당동이다",
        description: "유저 소개",
    })
    description: string;
}
