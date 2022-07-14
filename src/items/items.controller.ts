import { Controller, Get, Post, Body, Patch, Param, Delete, Put, UseGuards } from "@nestjs/common";
import { ItemsService } from "./items.service";
import { CreateItemDto } from "./dto/createItem.dto";
import { UpdateItemDto } from "./dto/updateItem.dto";
import { ApiBearerAuth, ApiHeader, ApiOperation, ApiTags } from "@nestjs/swagger";
import { User } from "src/users/user.decorator";
import { Users } from "src/users/entities/user.entity";
import { AuthGuard } from "@nestjs/passport";

@ApiTags("Items")
@Controller("api/items")
export class ItemsController {
    constructor(private readonly itemsService: ItemsService) {}

    @ApiOperation({ summary: "아이템 민팅", description: "아이템 민팅 페이지" })
    @ApiBearerAuth("access-token")
    @UseGuards(AuthGuard())
    @Post("minting")
    createItem(@User() user: Users, @Body() createItemDto: CreateItemDto) {
        return this.itemsService.createItem(user, createItemDto);
    }

    @ApiOperation({ summary: "아이템 상세보기", description: "아이템 상세보기 페이지" })
    @Get(":id")
    findByIdItem(@Param("id") id: number) {
        return this.itemsService.findByIdItem(id);
    }

    // @ApiOperation({summary: "아이템 좋아요",description: "아이템 좋아요 페이지",})
    // @Put(":NFTtocken")
    // isLike(@Param("NFTtoken") NFTtoken: string) {
    //     return `여기는 아이템 #${NFTtoken}의 좋아요 누르는 페이지`;
    // }

    // @ApiOperation({ summary: "아이템 수정", description: "아이템 수정 페이지" })
    // @Put(":id")
    // updateItem(@Param("id") id: number, @Body() updateItemDto: UpdateItemDto) {
    //     return this.itemsService.updateItem(id, updateItemDto);
    // }

    @ApiOperation({ summary: "아이템 삭제", description: "아이템 삭제 페이지" })
    @Delete(":id")
    deleteItem(@Param("id") id: number) {
        return this.itemsService.deleteItem(id);
    }
}
