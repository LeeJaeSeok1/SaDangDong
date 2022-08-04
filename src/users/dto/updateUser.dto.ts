import { PartialType } from "@nestjs/mapped-types";
import { ApiProperty } from "@nestjs/swagger";
import { CreateUserDto } from "./createUser.dto";

export class UpdateUserDto extends PartialType(CreateUserDto) {
    @ApiProperty({
        example: "sadangdong",
        description: "닉네임",
    })
    name: string;
}
