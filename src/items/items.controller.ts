import {
    Controller,
    Get,
    Post,
    Body,
    Param,
    Delete,
    UsePipes,
    UseInterceptors,
    ValidationPipe,
    UploadedFiles,
    Put,
} from "@nestjs/common";
import { ItemsService } from "./items.service";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { TransformInterceptor } from "src/config/transform.interceptor";
import { FilesInterceptor } from "@nestjs/platform-express";
import { storage } from "src/config/multerS3.config";
import { AuthToken } from "src/config/auth.decorator";
import { IsBtcAddress } from "class-validator";
import { UpdateItemDto } from "./dto/updateItem.dto";

@ApiTags("Items")
@Controller("api/items")
export class ItemsController {
    constructor(private readonly itemsService: ItemsService) {}

    // 임시아이템 생성
    @Post("temp")
    tempItem(@Body() data) {
        return this.itemsService.tempItem(token_id);
    }

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
        // console.log("files", files);
        // console.log("body", itemData);
        // console.log("user", addressId);
        // console.log("itemDate", itemData);

        return this.itemsService.createItem(files, itemData, address);
    }

    @Get("lasttoken")
    findLastinfor() {
        return this.itemsService.findLastItem();
    }

    // 유저의 컬렉션 가져오기
    @ApiOperation({ summary: "유저 컬렉션 받아오기" })
    @Get("collections")
    getCollection(@AuthToken() address: string) {
        return this.itemsService.findColleciton(address);
    }

    // 아이템 상세보기
    @ApiOperation({ summary: "아이템 상세보기", description: "아이템 상세보기 페이지" })
    @Get(":id")
    findByIdItem(@Param("id") id: string, @AuthToken() address: string) {
        return this.itemsService.itemDetail(id, address);
    }

    // 아이템 수정
    @ApiOperation({ summary: " 아이템 수정" })
    @UsePipes(TransformInterceptor)
    @Put(":id")
    updateItem(@Param("id") id: string, @Body(ValidationPipe) itemData: UpdateItemDto, @AuthToken() address: string) {
        console.log(itemData);
        console.log(id);
        return this.itemsService.updateItem(id, itemData, address);
    }

    // 아이템 삭제
    @ApiOperation({ summary: "아이템 삭제", description: "아이템 삭제 페이지" })
    @Delete(":id")
    deleteItem(@Param("id") id: string, @AuthToken() address: string) {
        return this.itemsService.deleteItem(id, address);
    }
}
