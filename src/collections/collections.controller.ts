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
} from "@nestjs/common";
import { CollectionsService } from "./collections.service";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { Collection } from "./entities/collection.entity";
import { AuthToken } from "src/config/auth.decorator";
import { TransformInterceptor } from "src/config/transform.interceptor";
import { storage } from "src/config/multerS3.config";
import { FilesInterceptor } from "@nestjs/platform-express";
import { throwIfEmpty } from "rxjs";

@ApiTags("Collections")
@Controller("api/collections")
export class CollectionsController {
    constructor(private readonly collectionsService: CollectionsService) {}

    @ApiOperation({ summary: "컬렉션 보기" })
    @Get()
    findCollections(): Promise<Collection[]> {
        return this.collectionsService.findCollection();
    }

    @ApiOperation({ summary: "컬렉션 상세보기" })
    @Get(":id")
    findOneColleciton(@Param("id") id: string) {
        console.log("컨트롤러 컬렉션 아이디", id);
        return this.collectionsService.findOneCollection(id);
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
        try {
            // console.log("collectionData", collectionData);
            // console.log("files", files);
            // console.log("address", address);

            const addressId = address.toLowerCase();
            // return Object.assign({
            //     statusCode: 201,
            //     statusMsg: "컬렉션을 생성했습니다.",
            //     data: collectionData,
            //     addressId,
            //     files,
            // });
            return this.collectionsService.newCollection(collectionData, files, addressId);
        } catch (error) {
            console.log("컨트롤러", error.message);
            throw new BadRequestException(error.message);
        }
    }

    @ApiOperation({ summary: "컬렉션 수정" })
    @Put(":id")
    @UsePipes(TransformInterceptor)
    @UseInterceptors(FilesInterceptor("files", 3, { storage: storage }))
    updateCollection(
        @Param("id") id: string,
        @UploadedFiles() files: Express.Multer.File[],
        @Body(ValidationPipe) updateData,
        @AuthToken() address: string,
    ) {
        try {
            const addressId = address.toLowerCase();
            console.log("컬럼수정 컨트롤러 어드레스 오리진", address);
            console.log("컬럼수정 컨트롤러 아이디 확인", id);
            console.log("컬럼수정 컨트롤러 어드레스", addressId);
            return this.collectionsService.updateCollection(id, updateData, addressId, files);
        } catch (error) {
            throw new BadRequestException(error.message);
        }
    }

    @ApiOperation({ summary: "컬렉션 삭제" })
    @Delete(":id")
    deleteCollection(@Param("id") id: string, @AuthToken() address: string) {
        try {
            console.log("컬럼삭세 컨트롤러 어드레스 오리진", address);
            const addressId = address.toLowerCase();
            console.log("컬럼삭제 컨트롤러 아이디 확인", id);
            console.log("컬럼삭제 컨트롤러 어드레스", addressId);
            return this.collectionsService.deleteCollection(id, addressId);
        } catch (error) {
            console.log("컨트롤러 캐치 에러", error.message);
            throw new BadRequestException(error.message);
        }
    }
}
