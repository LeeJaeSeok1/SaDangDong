import { Controller, Get, Post, Body, Patch, Param, Delete } from "@nestjs/common";
import { ExploreService } from "./explore.service";
import { CreateExploreDto } from "./dto/create-explore.dto";
import { UpdateExploreDto } from "./dto/update-explore.dto";
import { ApiOperation, ApiQuery, ApiTags } from "@nestjs/swagger";

@ApiTags("Explore")
@Controller("api")
export class ExploreController {
    constructor(private readonly exploreService: ExploreService) {}

    @ApiOperation({
        summary: "메인",
        description: "메인 패이지",
    })
    @Get("main")
    findMain() {
        return this.exploreService.findAll();
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
    findAll() {
        return this.exploreService.findAll();
    }
}
