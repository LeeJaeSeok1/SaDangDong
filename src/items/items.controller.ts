import {
    Controller,
    Get,
    Post,
    Body,
    Param,
    Delete,
    UsePipes,
    UseInterceptors,
    BadRequestException,
    ValidationPipe,
    UploadedFiles,
} from "@nestjs/common";
import { ItemsService } from "./items.service";
import { CreateItemDto } from "./dto/createItem.dto";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { TransformInterceptor } from "src/config/transform.interceptor";
import { FilesInterceptor } from "@nestjs/platform-express";
import { storage } from "src/config/multerS3.config";
import { AuthToken } from "src/config/auth.decorator";

@ApiTags("Items")
@Controller("api/items")
export class ItemsController {
    constructor(private readonly itemsService: ItemsService) {}

    @ApiOperation({ summary: "아이템 민팅", description: "아이템 민팅 페이지" })
    @Post("minting")
    @UsePipes(TransformInterceptor)
    @UseInterceptors(FilesInterceptor("files", 2, { storage: storage }))
    createItem(
        @UploadedFiles() files: Express.Multer.File[],
        @Body(ValidationPipe) itemData: CreateItemDto,
        @AuthToken() address: string,
    ) {
        try {
            console.log("files", files);
            console.log("body", itemData);
            console.log("user", address);
            return this.itemsService.createItem(files, itemData, address);
        } catch (error) {
            throw new BadRequestException(error.message);
        }
    }

    @ApiOperation({ summary: "아이템 민팅", description: "아이템 민팅 페이지" })
    @Get("minting")
    @UsePipes(TransformInterceptor)
    getCollection(@AuthToken() address: string) {
        return this.itemsService.findColleciton(address);
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
