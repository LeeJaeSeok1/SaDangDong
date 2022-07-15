import { Controller, Get, Post, Body, Param, Query, Put, UsePipes, ValidationPipe } from "@nestjs/common";
import { UsersService } from "./users.service";
import { ApiBody, ApiHeader, ApiOperation, ApiQuery, ApiTags } from "@nestjs/swagger";
import { User } from "./entities/user.entity";
import { CreateUserDto } from "./dto/createUser.dto";
import { TransformInterceptor } from "src/config/transform.interceptor";
import { UpdateUserDto } from "./dto/updateUser.dto";
import { AuthToken } from "src/config/auth.decorator";

@ApiTags("Account")
@Controller("account")
export class UsersController {
    constructor(private usersService: UsersService) {}

    @ApiOperation({ summary: "사인페이지" })
    @ApiBody({ type: CreateUserDto })
    @Post("auth")
    @UsePipes(ValidationPipe)
    async sign(@Body() address: CreateUserDto) {
        return this.usersService.sign(address);
    }

    @ApiOperation({ summary: "회원수정 페이지" })
    @ApiHeader({ name: "address" })
    @Put("setting")
    @UsePipes(TransformInterceptor)
    async setting(@Body(ValidationPipe) editUser: UpdateUserDto, @AuthToken() address: string) {
        return this.usersService.settingUser(editUser, address);
    }

    @ApiQuery({
        name: "tab",
        required: true,
        description: "tab = collection, item, favorites",
    })
    @ApiOperation({
        summary: "USER 페이지",
        description: "유저 collection, item, favorites 페이지",
    })
    @Get(":id?")
    getUserInfo(@Param("id") id: string, @Query("tab") tab: string, @AuthToken() address: string): Promise<User> {
        return this.usersService.userInfo(id, tab, address);
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
    @Post("me")
    async test() {}
}
