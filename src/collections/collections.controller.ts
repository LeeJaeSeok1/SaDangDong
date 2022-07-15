import { Controller, Get, Post, Body, Param, Delete, Put, UsePipes, ValidationPipe } from "@nestjs/common";
import { CollectionsService } from "./collections.service";
import { CreateCollectionDto } from "./dto/createCollection.dto";
import { UpdateCollectionDto } from "./dto/updateCollection.dto";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { Collection } from "./entities/collection.entity";
import { AuthToken } from "src/config/auth.decorator";
import { TransformInterceptor } from "src/config/transform.interceptor";

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
    createdColleciton(@Body(ValidationPipe) createCollectionDto: CreateCollectionDto, @AuthToken() address: string) {
        return this.collectionsService.createdCollection(createCollectionDto, address);
    }

    @ApiOperation({ summary: "컬렉션 수정" })
    @Put(":id")
    @UsePipes(TransformInterceptor)
    updateCollection(
        @Param("id") id: number,
        @Body(ValidationPipe) updateCollection: UpdateCollectionDto,
        @AuthToken() address: string,
    ) {
        return this.collectionsService.updateCollection(id, updateCollection, address);
    }

    @ApiOperation({ summary: "컬렉션 삭제" })
    @Delete(":id")
    @UsePipes(ValidationPipe)
    deleteCollection(@Param("id") id: number, @AuthToken() address: string) {
        return this.collectionsService.deleteCollection(id, address);
    }
}
