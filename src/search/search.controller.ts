import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from "@nestjs/common";
import { SearchService } from "./search.service";
import { CreateSearchDto } from "./dto/create-search.dto";
import { UpdateSearchDto } from "./dto/update-search.dto";
import { ApiOperation, ApiQuery, ApiTags } from "@nestjs/swagger";

@ApiTags("Search")
@Controller("api/search")
export class SearchController {
    constructor(private readonly searchService: SearchService) {}

    // 검색
    @ApiQuery({
        name: "name",
        required: true,
        description: "name = value",
    })
    @ApiQuery({
        name: "tab",
        required: true,
        description: "tab = collection, item, auction",
    })
    @ApiOperation({
        summary: "검색",
        description: "검색 페이지",
    })
    @Get()
    getSearchInfo(@Query("tab") tab: string, @Query("name") name: string) {
        console.log(name, tab);
        const stringTab = decodeURIComponent(tab);
        const stringName = decodeURIComponent(name);
        return this.searchService.searchInfo(stringTab, stringName);
    }
}
