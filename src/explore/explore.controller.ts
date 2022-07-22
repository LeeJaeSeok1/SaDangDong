import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from "@nestjs/common";
import { ExploreService } from "./explore.service";
import { CreateExploreDto } from "./dto/create-explore.dto";
import { UpdateExploreDto } from "./dto/update-explore.dto";
import { ApiOperation, ApiQuery, ApiTags } from "@nestjs/swagger";
import { AuthToken } from "src/config/auth.decorator";

@ApiTags("Explore")
@Controller("api")
export class ExploreController {
    constructor(private readonly exploreService: ExploreService) {}

    @ApiOperation({
        summary: "메인",
        description: "메인 패이지",
    })
    @Get("main")
    getMainInfo() {
        return this.exploreService.mainInfo();
    }

    @ApiQuery({
        name: "tab",
        required: true,
        description: "tab = collection, item, auction",
    })
    @ApiOperation({
        summary: "전체보기",
        description: "전체보기 패이지",
    })
    @Get("explore")
    getExploreInfo(@Query("tab") tab: string, @AuthToken() address: string) {
        console.log(tab);
        return this.exploreService.exploreInfo(tab, address);
    }
}
