import { Controller, Get, Post, Body, Patch, Param, Delete } from "@nestjs/common";
import { AuthorUsersService } from "./authorUsers.service";
import { CreateAuthorUserDto } from "./dto/createAuthorUser.dto";
import { UpdateAuthorUserDto } from "./dto/updateAuthorUser.dto";
import { ApiOperation, ApiTags, ApiQuery } from "@nestjs/swagger";

@ApiTags("AuthotUsers")
@Controller("api/:walletId")
export class AuthorUsersController {
    constructor(private readonly authorUsersService: AuthorUsersService) {}

    @ApiQuery({
        name: "tab",
        required: true,
        description: "tab= collection, item, favorites",
    })
    @ApiOperation({
        summary: "다른 유저 컬렉션 보기",
        description: "다른 유저 컬렉션 보기 페이지",
    })
    @Get()
    findAll() {
        return this.authorUsersService.findAll();
    }
}
