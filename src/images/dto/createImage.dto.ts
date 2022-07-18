import { ApiProperty } from "@nestjs/swagger";

export class CreateImageDto {
    @ApiProperty({
        example: "logoImage",
        description: "이미지 타겟(logoImage, bennerImage, featureImage)",
    })
    name: string;

    description: string;
}
