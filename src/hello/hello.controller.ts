import { Controller, Get, Param, Query } from "@nestjs/common";
import { HelloService } from "./hello.service";
import { ApiOperation, ApiTags, ApiQuery } from "@nestjs/swagger";

@ApiTags("Hello")
@Controller("api/hello")
export class HelloController {
    constructor(private readonly helloService: HelloService) {}

    // @ApiQuery({
    //     name: "tab",
    //     required: true,
    //     description: "tab = collection, item, favorites",
    // })
    // @ApiOperation({
    //     summary: "다른 유저 컬렉션 보기",
    //     description: "다른 유저 컬렉션 보기 페이지",
    // })
    // @Get(":address")
    // getAuthorInfo(@Param("address") address: string, @Query("tab") tab: string) {
    //     return this.authorUsersService.authorInfo(tab, address);
    // }
}
