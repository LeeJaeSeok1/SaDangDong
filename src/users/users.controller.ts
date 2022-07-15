import { Controller, Get, Post, Body, Patch, Param, Delete, Query, Put, UseGuards } from "@nestjs/common";
import { UsersService } from "./users.service";
import { CreateUserDto } from "./dto/createUser.dto";
import { ApiBearerAuth, ApiHeader, ApiOperation, ApiQuery, ApiTags } from "@nestjs/swagger";
import { Users } from "./entities/user.entity";
import { User } from "./user.decorator";
import { AuthGuard } from "@nestjs/passport";

@ApiTags("Account")
@Controller("api/account")
export class UsersController {
    constructor(private usersService: UsersService) {}

    @ApiOperation({ summary: "회원가입" })
    @Post("sign")
    async signUp(@Body() createUserDto: CreateUserDto) {
        return this.usersService.signUp(createUserDto);
    }

    // @ApiOperation({ summary: "로그인" })
    // @Post("signin")
    // async login(@Body() createUserDto: CreateUserDto): Promise<{ accessToken: string }> {
    //     return this.usersService.logIn(createUserDto);
    // }

    @ApiOperation({ summary: "사인페이지" })
    @Post("auth")
    async sign(@Body() createUserDto: CreateUserDto) {
        return this.usersService.sign(createUserDto);
    }
    // @ApiOperation({ summary: "특정 유저 가져오기"})
    // @Get(":id")
    // async getUser(@Param("id") id: number) {
    //     return this.usersService.findById(id);
    // }

    @ApiQuery({
        name: "tab",
        required: true,
        description: "tab = collection, item, favorites",
    })
    @ApiOperation({
        summary: "USER 페이지",
        description: "유저 collection, item, favorites 페이지",
    })
    @ApiBearerAuth("access-token")
    @UseGuards(AuthGuard())
    @Get(":id?")
    getUserInfo(@User() user: Users, @Param("id") id: number, @Query("tab") tab: string): Promise<Users> {
        return this.usersService.userInfo(id, tab, user);
    }

    // 쿼리 스트링 예제
    // 쿼리 매개변수를 제공하려면 /article/findByFilter/bug? google=1&baidu=2 , 다음을 사용할 수 있습니다.

    // @Get('/article/findByFilter/bug?')
    // async find(
    //     @Query('google') google: number,
    //     @Query('baidu') baidu: number,
    // )

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
    @ApiOperation({ summary: "유저확인" })
    @ApiBearerAuth("access-token")
    @UseGuards(AuthGuard())
    @Post("me")
    async test(@User() user: Users) {
        console.log("user", user);
    }
}
