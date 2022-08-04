import { Controller, Get, Query, UseFilters } from "@nestjs/common";
import { SearchService } from "./search.service";
import { ApiOperation, ApiQuery, ApiTags } from "@nestjs/swagger";
import { AuthToken } from "src/config/auth.decorator";

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
    getSearchInfo(
        @Query("tab") tab: string,
        @Query("name") name: string,
        @Query("_page") _page: number,
        @Query("_limit") _limit: number,
        @AuthToken() address: string,
    ) {
        console.log(name, tab, address, _page, _limit);
        console.log(typeof name);
        // const stringTab = decodeURIComponent(tab);
        // const stringName = decodeURIComponent(name);
        return this.searchService.searchInfo(tab, name, _page, _limit, address);
    }
}
