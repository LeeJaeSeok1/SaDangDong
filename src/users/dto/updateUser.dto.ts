import { PartialType } from "@nestjs/mapped-types";
import { ApiProperty } from "@nestjs/swagger";
import { CreateUserDto } from "./createUser.dto";

export class UpdateUserDto extends PartialType(CreateUserDto) {
    @ApiProperty({
        example: "https://sadangdong.com",
        description: "로고 이미지 URL",
    })
    profile_image: string;

    @ApiProperty({
        example: "https://sadangdong.com",
        description: "베너 이미지 RUL",
    })
    benner_image: string;

    @ApiProperty({
        example: "sadangdong",
        description: "닉네임",
    })
    name: string;
}
