import { Controller, Get, Param, Query } from "@nestjs/common";
import { AuthorUsersService } from "./authorUsers.service";
import { ApiOperation, ApiTags, ApiQuery } from "@nestjs/swagger";

@ApiTags("AuthotUsers")
@Controller("api")
export class AuthorUsersController {
    constructor(private readonly authorUsersService: AuthorUsersService) {}

    @ApiQuery({
        name: "tab",
        required: true,
        description: "tab = collection, item, favorites",
    })
    @ApiOperation({
        summary: "다른 유저 컬렉션 보기",
        description: "다른 유저 컬렉션 보기 페이지",
    })
    @Get(":address")
    getAuthorInfo(@Param("address") address: string, @Query("tab") tab: string) {
        return this.authorUsersService.authorInfo(tab, address);
    }
}
