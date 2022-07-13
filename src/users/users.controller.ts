import { Controller, Get, Post, Body, Patch, Param, Delete, Query, Put, UseGuards } from "@nestjs/common";
import { UsersService } from "./users.service";
import { CreateUserDto } from "./dto/createUser.dto";
import { ApiOperation, ApiQuery, ApiTags } from "@nestjs/swagger";
import { Users } from "./entities/user.entity";
import { User } from "./user.decorator";
import { AuthGuard } from "@nestjs/passport";

@ApiTags("Account")
@Controller("api/account")
export class UsersController {
    constructor(private usersService: UsersService) {}

    @ApiOperation({ summary: "회원가입", description: "회원 페이지" })
    @Post("sign")
    async signUp(@Body() createUserDto: CreateUserDto) {
        return this.usersService.signUp(createUserDto);
    }

    @Post("signin")
    async login(@Body() createUserDto: CreateUserDto): Promise<{ accessToken: string }> {
        createUserDto.nickname;
        createUserDto.password;
        return this.usersService.logIn(createUserDto);
    }

    @Get(":id")
    async getUser(@Param("id") id: number) {
        return this.usersService.findById(id);
    }

    @Get(":id/collection")
    async getUserCollectin(@Param("id") id: number) {
        return this.usersService.getUserCollection(id);
    }

    @Post("me")
    @UseGuards(AuthGuard())
    async test(@User() user: Users) {
        console.log("user", user);
    }

    // @ApiQuery({
    //     name: "tab",
    //     required: true,
    //     description: "tab= collection, item, favorites",
    // })
    @ApiOperation({
        summary: "USER 페이지",
        description: "유저 collection, item, favorites 페이지",
    })
    @Get()
    findAll(): Promise<Users[]> {
        return this.usersService.findAll();
    }

    // @ApiOperation({
    //     summary: "USER 정보수정 페이지",
    //     description: "유저 정보수정 페이지",
    // })
    // @Put("settings")
    // update(@Param("id") id: string, @Body() updateUserDto: UpdateUserDto) {
    //     return this.usersService.update(+id, updateUserDto);
    // }

    // @Put(":nickname")
    // update(@Param("nickname") nickname: string, @Body() user: User) {
    //     this.usersService.update(nickname, user);
    //     return `This action updates a #${nickname} user`;
    // }

    // @ApiOperation({
    //     summary: "USER 컬렉션 수정 페이지",
    //     description: "유저 컬렉션수정 페이지",
    // })
    // @Put("collection/:collectionName/edit")
    // collectionPut(@Param("collecitonName") collecitonName: string) {
    //     return this.usersService.remove(+collecitonName);
    // }

    // @ApiOperation({
    //     summary: "USER 컬렉션 삭제 페이지",
    //     description: "유저 컬렉션 삭제 페이지",
    // })
    // @Put("collection/:collectionName/edit")
    // collectionDelete(@Param("collectionName") collectionName: string) {
    //     return this.usersService.remove(+collectionName);
    // }

    // @Delete(":nickname")
    // remove(@Param("nickname") nickname: string) {
    //     this.usersService.remove(nickname);
    //     return `This action removes a #${nickname} user`;
    // }
}
