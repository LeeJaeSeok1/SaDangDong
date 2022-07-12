import { Controller, Get, Post, Body, Patch, Param, Delete, Put } from "@nestjs/common";
import { CollectionsService } from "./collections.service";
import { CreateCollectionDto } from "./dto/createCollection.dto";
import { UpdateCollectionDto } from "./dto/updateCollection.dto";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { Collection } from "./entities/collection.entity";
import { User } from "src/users/entities/user.entity";

@ApiTags("Collections")
@Controller("api/collections")
export class CollectionsController {
    constructor(private readonly collectionsService: CollectionsService) {}

    @ApiOperation({ summary: "컬렉션 생성", description: "컬렉션 생성 페이지" })
    @Post()
    createCollection(@Body() createCollectionDto: CreateCollectionDto) {
        return this.collectionsService.createCollection(createCollectionDto);
    }
    // @Post()
    // createColleciton(@User() userId: number, @Body() createCollectionDto: CreateCollectionDto) {
    //     return this.collectionsService.createCollection(userId, createCollectionDto);
    // }

    @ApiOperation({ summary: "컬렉션 보기" })
    @Get()
    findCollections(): Promise<Collection[]> {
        return this.collectionsService.findCollection();
    }

    @ApiOperation({ summary: "컬렉션 수정" })
    @Put(":id")
    updateCollection(@Param("id") id: number, @Body() updateCollection: UpdateCollectionDto) {
        return this.collectionsService.updateCollection(id, updateCollection);
    }

    @ApiOperation({ summary: "컬렉션 삭제" })
    @Delete(":id")
    deleteCollection(@Param("id") id: number) {
        return this.collectionsService.deleteCollection(id);
    }
}
