import {
    Controller,
    Get,
    Post,
    Body,
    Param,
    Delete,
    Put,
    UseGuards,
    UseInterceptors,
    UploadedFiles,
} from "@nestjs/common";
import { CollectionsService } from "./collections.service";
import { CreateCollectionDto } from "./dto/createCollection.dto";
import { UpdateCollectionDto } from "./dto/updateCollection.dto";
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger";
import { Collection } from "./entities/collection.entity";
import { User } from "src/users/user.decorator";
import { Users } from "src/users/entities/user.entity";
import { AuthGuard } from "@nestjs/passport";
import { UpdateSearchDto } from "src/search/dto/update-search.dto";
import { FilesInterceptor } from "@nestjs/platform-express";
import { storage } from "src/config/multerS3.config";

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
    @ApiBearerAuth("access-token")
    @UseGuards(AuthGuard())
    @Post()
    // @UseInterceptors(FilesInterceptor("files", 3, { storage: storage }))
    createdColleciton(
        // @UploadedFiles() files: Express.Multer.File[],
        @User() user: Users,
        @Body() createCollectionDto: CreateCollectionDto,
    ) {
        return this.collectionsService.createdCollection(user, createCollectionDto);
    }

    @ApiOperation({ summary: "컬렉션 수정" })
    @ApiBearerAuth("access-token")
    @UseGuards(AuthGuard())
    @Put(":id")
    updateCollection(@User() user: Users, @Param("id") id: number, @Body() updateCollection: UpdateCollectionDto) {
        return this.collectionsService.updateCollection(id, updateCollection, user);
    }

    @ApiOperation({ summary: "컬렉션 삭제" })
    @ApiBearerAuth("access-token")
    @UseGuards(AuthGuard())
    @Delete(":id")
    deleteCollection(@User() user: Users, @Param("id") id: number) {
        return this.collectionsService.deleteCollection(id, user);
    }
}
