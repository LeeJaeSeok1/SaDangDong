import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";
export class CreateUserDto {
    @IsNotEmpty()
    @ApiProperty({
        example: "0x49815781208098f0a9s78f0d09fa8934",
        description: "유저 지갑주소",
    })
    walletId: string;
}
