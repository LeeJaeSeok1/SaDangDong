import {
    Controller,
    Get,
    Post,
    Body,
    Param,
    Delete,
    Put,
    UsePipes,
    ValidationPipe,
    BadRequestException,
    UseInterceptors,
    UploadedFiles,
    UseFilters,
    Query,
} from "@nestjs/common";
import { CollectionsService } from "./collections.service";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { Collection } from "./entities/collection.entity";
import { AuthToken } from "src/config/auth.decorator";
import { TransformInterceptor } from "src/config/transform.interceptor";
import { storage } from "src/config/multerS3.config";
import { FilesInterceptor } from "@nestjs/platform-express";

@ApiTags("Collections")
@Controller("api/collections")
export class CollectionsController {
    constructor(private readonly collectionsService: CollectionsService) {}

    @ApiOperation({ summary: "컬렉션 보기" })
    @Get(":name")
    findCollections(@Param("name") name: string) {
        return this.collectionsService.findByOneCollection(name);
    }

    @ApiOperation({ summary: "컬렉션 상세보기" })
    @Get("/info/:name")
    findOneColleciton(
        @Param("name") name: string,
        @Query("tab") tab: string,
        @Query("_page") _page: number,
        @Query("_limit") _limit: number,
        @AuthToken() address: string,
    ) {
        // console.log("컨트롤러 컬렉션 아이디", id);
        return this.collectionsService.findOneCollection(name, tab, _page, _limit, address);
    }

    @ApiOperation({ summary: "컬렉셩 생성" })
    @Post()
    @UsePipes(TransformInterceptor)
    @UseInterceptors(FilesInterceptor("files", 3, { storage: storage }))
    async createdColleciton(
        @UploadedFiles() files: Express.Multer.File[],
        @Body(ValidationPipe) collectionData,
        @AuthToken() address: string,
    ) {
        return this.collectionsService.newCollection(collectionData, files, address);
    }

    @ApiOperation({ summary: "컬렉션 수정" })
    @Put(":name")
    @UsePipes(TransformInterceptor)
    @UseInterceptors(FilesInterceptor("files", 3, { storage: storage }))
    updateCollection(
        @Param("name") name: string,
        @UploadedFiles() files: Express.Multer.File[],
        @Body(ValidationPipe) updateData,
        @AuthToken() address: string,
    ) {
        try {
            console.log("컬럼수정 컨트롤러 어드레스 오리진", address);
            console.log("컬럼수정 컨트롤러 아이디 확인", name);
            return this.collectionsService.updateCollection(name, updateData, address, files);
        } catch (error) {
            console.log("에러메세지", error.message);
            throw new BadRequestException(error.message);
        }
    }

    @ApiOperation({ summary: "컬렉션 삭제" })
    @Delete(":name")
    deleteCollection(@Param("name") name: string, @AuthToken() address: string) {
        try {
            console.log("컬럼삭세 컨트롤러 어드레스 오리진", address);
            console.log("컬럼삭제 컨트롤러 아이디 확인", name);
            return this.collectionsService.deleteCollection(name, address);
        } catch (error) {
            console.log("컨트롤러 캐치 에러", error.message);
            throw new BadRequestException(error.message);
        }
    }
}
