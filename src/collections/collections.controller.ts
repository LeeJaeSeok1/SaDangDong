import { Controller, Get, Post, Body, Patch, Param, Delete, Put, UseGuards, ValidationPipe } from "@nestjs/common";
import { CollectionsService } from "./collections.service";
import { CreateCollectionDto } from "./dto/createCollection.dto";
import { UpdateCollectionDto } from "./dto/updateCollection.dto";
import { ApiHeader, ApiOperation, ApiTags } from "@nestjs/swagger";
import { Collection } from "./entities/collection.entity";
import { User } from "src/users/user.decorator";
import { Users } from "src/users/entities/user.entity";
import { AuthGuard } from "@nestjs/passport";

@ApiTags("Collections")
@Controller("api/collections")
export class CollectionsController {
    constructor(private readonly collectionsService: CollectionsService) {}

    // @ApiOperation({ summary: "컬렉션 생성", description: "컬렉션 생성 페이지" })
    // @Post()
    // createCollection(@Body() createCollectionDto: CreateCollectionDto) {
    //     return this.collectionsService.createCollection(createCollectionDto);
    // }

    @ApiOperation({ summary: "컬렉션 생성", description: "컬렉션 생성 페이지" })
    @ApiHeader({ name: "Authorization" })
    @UseGuards(AuthGuard())
    @Post()
    createdColleciton(@User() user: Users, @Body() createCollectionDto: CreateCollectionDto) {
        return this.collectionsService.createdCollection(user, createCollectionDto);
    }

    // @Post()
    // @UseGuards(ValidationPipe)
    // newCollection(@Body() collectionData: CreateCollectionDto, @User() user: Users): Promise<Collection> {
    //     return this.collectionsService.newCollection(collectionData, user);
    // }

    // @ApiOperation({ summary: "컬렉션 생성", description: "컬렉션 생성 페이지" })
    // @Patch(":userId")
    // newCollection(@Param("userId") userId: number, @Body() createCollectionDto: CreateCollectionDto) {
    //     console.log("id", userId);
    //     return this.collectionsService.newCollection(userId, createCollectionDto);
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
