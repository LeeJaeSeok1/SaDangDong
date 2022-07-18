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
import { CreateCollectionDto } from "./dto/createCollection.dto";
import { UpdateCollectionDto } from "./dto/updateCollection.dto";
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

    @ApiOperation({ summary: "컬렉션 생성", description: "컬렉션 생성 페이지" })
    @Post()
    @UsePipes(TransformInterceptor)
    newColleciton(@Body(ValidationPipe) createCollectionDto: CreateCollectionDto, @AuthToken() address: string) {
        try {
            return this.collectionsService.createdCollection(createCollectionDto, address);
        } catch (error) {
            throw new BadRequestException(error.message);
        }
    }

    @ApiOperation({ summary: "컬렉셩 생성" })
    @Post("test")
    @UsePipes(TransformInterceptor)
    @UseInterceptors(FilesInterceptor("files", 3, { storage: storage }))
    createdColleciton(
        @UploadedFiles() files: Express.Multer.File[],
        @Body(ValidationPipe) collectionData: CreateCollectionDto,
    ) {
        try {
            return this.collectionsService.newCollection(collectionData, files);
        } catch (error) {
            throw new BadRequestException(error.message);
        }
    }

    @ApiOperation({ summary: "컬렉션 수정" })
    @Put(":id")
    @UsePipes(TransformInterceptor)
    updateCollection(
        @Param("id") id: number,
        @Body(ValidationPipe) updateCollection: UpdateCollectionDto,
        @AuthToken() address: string,
    ) {
        try {
            return this.collectionsService.updateCollection(id, updateCollection, address);
        } catch (error) {
            throw new BadRequestException(error.message);
        }
    }

    @ApiOperation({ summary: "컬렉션 삭제" })
    @Delete(":id")
    @UsePipes(ValidationPipe)
    deleteCollection(@Param("id") id: number, @AuthToken() address: string) {
        return this.collectionsService.deleteCollection(id, address);
    }
}
