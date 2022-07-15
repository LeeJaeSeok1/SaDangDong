import { Controller, Get, Post, Body, Patch, Param, Delete } from "@nestjs/common";
import { LikeService } from "./like.service";
import { CreateLikeDto } from "./dto/createLike.dto";
import { UpdateLikeDto } from "./dto/updateLike.dto";

@Controller("favorites")
export class LikeController {
    constructor(private readonly favoritesService: LikeService) {}

    //   @Post()
    //   create(@Body() createFavoriteDto: CreateFavoriteDto) {
    //     return this.favoritesService.create(createFavoriteDto);
    //   }

    //   @Get()
    //   findAll() {
    //     return this.favoritesService.findAll();
    //   }

    //   @Get(':id')
    //   findOne(@Param('id') id: string) {
    //     return this.favoritesService.findOne(+id);
    //   }

    //   @Patch(':id')
    //   update(@Param('id') id: string, @Body() updateFavoriteDto: UpdateFavoriteDto) {
    //     return this.favoritesService.update(+id, updateFavoriteDto);
    //   }

    //   @Delete(':id')
    //   remove(@Param('id') id: string) {
    //     return this.favoritesService.remove(+id);
    //   }
}
