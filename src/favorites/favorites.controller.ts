import { Controller, Get, Post, Body, Patch, Param, Delete, Put, UsePipes } from "@nestjs/common";
import { LikeService } from "./favorites.service";
import { ApiOperation } from "@nestjs/swagger";
import { TransformInterceptor } from "src/config/transform.interceptor";
import { AuthToken } from "src/config/auth.decorator";

@Controller("/api/like")
export class LikeController {
    constructor(private likeService: LikeService) {}

    @ApiOperation({ summary: "좋아요" })
    @Put(":id/like")
    @UsePipes(TransformInterceptor)
    async likeItem(@Param("id") id: string, @AuthToken() address: string) {
        return await this.likeService.likeItem(id, address);
    }

    @ApiOperation({ summary: "좋아요 취소" })
    @Put(":id/dislike")
    @UsePipes(TransformInterceptor)
    async dislikeItem(@Param("id") id: string, @AuthToken() address: string) {
        return await this.likeService.disLikeItem(id, address);
    }
}
