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

    // 아이템 생성
    @ApiOperation({ summary: "아이템 민팅", description: "아이템 민팅 페이지" })
    @Post("minting")
    @UsePipes(TransformInterceptor)
    @UseInterceptors(FilesInterceptor("files", 2, { storage: storage }))
    createItem(
        @UploadedFiles() files: Express.Multer.File[],
        @Body(ValidationPipe) itemData,
        @AuthToken() address: string,
    ) {
        try {
            // console.log("files", files);
            // console.log("body", itemData);
            // console.log("user", addressId);
            // console.log("itemDate", itemData);
            const json = itemData.itemInfo;
            // console.log(json, "json");
            const obj = JSON.parse(json);
            return this.itemsService.createItem(files, obj, address);
        } catch (error) {
            console.log("컨트롤러", error.message);
            throw new BadRequestException(error.message);
        }
    }

    // 유저의 컬렉션 가져오기
    @ApiOperation({ summary: "아이템 민팅", description: "아이템 민팅 페이지" })
    @Get("minting")
    @UsePipes(TransformInterceptor)
    getCollection(@AuthToken() address: string) {
        // console.log("아이템민팅컬렉션", address);
        return this.itemsService.findColleciton(address);
    }

    // 아이템 상세보기
    @ApiOperation({ summary: "아이템 상세보기", description: "아이템 상세보기 페이지" })
    @Get(":id")
    findByIdItem(@Param("id") id: string) {
        return this.itemsService.itemDetail(id);
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
    deleteItem(@Param("id") id: string, @AuthToken() address: string) {
        return this.itemsService.deleteItem(id, address);
    }
}
