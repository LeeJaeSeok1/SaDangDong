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
        return this.collectionsService.findOneCollection(id);
    }

    @ApiOperation({ summary: "컬렉셩 생성" })
    @Post()
    @UsePipes(TransformInterceptor)
    @UseInterceptors(FilesInterceptor("files", 3, { storage: storage }))
    createdColleciton(
        @UploadedFiles() files: Express.Multer.File[],
        @Body(ValidationPipe) collectionData,
        @AuthToken() address: string,
    ) {
        try {
            console.log("collectionData", collectionData);
            console.log("files", files);
            console.log("address", address);
            const addressId = address.toLowerCase();
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
            return this.collectionsService.updateCollection(id, updateData, addressId, files);
        } catch (error) {
            throw new BadRequestException(error.message);
        }
    }

    @ApiOperation({ summary: "컬렉션 삭제" })
    @Delete(":id")
    @UsePipes(ValidationPipe)
    deleteCollection(@Param("id") id: string, @AuthToken() address: string) {
        const addressId = address.toLowerCase();
        return this.collectionsService.deleteCollection(id, addressId);
    }
}
