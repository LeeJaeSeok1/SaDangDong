import { Controller, Get, Post, Body, Patch, Param, Delete, Put, UsePipes } from "@nestjs/common";
import { LikeService } from "./like.service";
import { CreateLikeDto } from "./dto/createLike.dto";
import { UpdateLikeDto } from "./dto/updateLike.dto";
import { ApiOperation } from "@nestjs/swagger";
import { TransformInterceptor } from "src/config/transform.interceptor";
import { AuthToken } from "src/config/auth.decorator";

@Controller("like")
export class LikeController {
    constructor(private likeService: LikeService) {}

    @ApiOperation({ summary: "좋아요" })
    @Put(":id")
    @UsePipes(TransformInterceptor)
    async likeItem(@Param("id") id: string, @AuthToken() address: string) {
        await this.likeService.likeItem(id, address);
        return Object.assign({
            statusCode: 201,
            statusMsg: "좋아요에 추가 했습니다.",
            data: { ...this.likeItem },
        });
    }
}
