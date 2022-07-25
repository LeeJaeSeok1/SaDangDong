import { Controller, Param, Put, UseFilters, UsePipes } from "@nestjs/common";
import { FavoritesService } from "./favorites.service";
import { ApiOperation } from "@nestjs/swagger";
import { TransformInterceptor } from "src/config/transform.interceptor";
import { AuthToken } from "src/config/auth.decorator";

@Controller("/api/favorites")
export class FavoritesController {
    constructor(private favoritesService: FavoritesService) {}

    @ApiOperation({ summary: " 좋아요/ 좋아요 취소" })
    @Put(":id")
    @UsePipes(TransformInterceptor)
    async favorites(@Param("id") id: string, @AuthToken() address: string) {
        return await this.favoritesService.favorites(id, address);
    }

    // @ApiOperation({ summary: "좋아요" })
    // @Put(":id/true")
    // @UsePipes(TransformInterceptor)
    // // id 는 아이템의 token_id
    // async likeItem(@Param("id") id: string, @AuthToken() address: string) {
    //     return await this.favoritesService.likeItem(id, address);
    // }

    // @ApiOperation({ summary: "좋아요 취소" })
    // @Put(":id/false")
    // @UsePipes(TransformInterceptor)
    // async dislikeItem(@Param("id") id: string, @AuthToken() address: string) {
    //     return await this.favoritesService.disLikeItem(id, address);
    // }
}
