import {
    Controller,
    Get,
    Post,
    Body,
    Param,
    Query,
    Put,
    UsePipes,
    ValidationPipe,
    UseInterceptors,
    BadRequestException,
    UploadedFiles,
} from "@nestjs/common";
import { UsersService } from "./users.service";
import { ApiBody, ApiHeader, ApiOperation, ApiQuery, ApiTags } from "@nestjs/swagger";
import { CreateUserDto } from "./dto/createUser.dto";
import { TransformInterceptor } from "src/config/transform.interceptor";
import { AuthToken } from "src/config/auth.decorator";
import { FilesInterceptor } from "@nestjs/platform-express";
import { storage } from "src/config/multerS3.config";

@ApiTags("Account")
@Controller("api/account")
export class UsersController {
    constructor(private usersService: UsersService) {}

    // 유저 로그인
    @ApiOperation({ summary: "사인페이지" })
    @ApiBody({ type: CreateUserDto })
    @Post("auth")
    @UsePipes(ValidationPipe)
    async sign(@AuthToken() address: string) {
        let addressId = address.toLowerCase();
        console.log("컨트롤러 address", addressId);
        return this.usersService.sign(addressId);
    }

    // 마이페이지
    @ApiQuery({
        name: "tab",
        required: true,
        description: "tab = collection, item, favorites",
    })
    @ApiOperation({
        summary: "USER 페이지",
        description: "유저 collection, item, favorites 페이지",
    })
    @Get(":id")
    getUserInfo(@Param("id") id: string, @AuthToken() address: string, @Query("tab") tab: string) {
        const addressId = address.toLowerCase();
        return this.usersService.userInfo(id, addressId, tab);
    }

    @ApiOperation({ summary: "회원수정 페이지" })
    @ApiHeader({ name: "address" })
    @Put("setting")
    @UseInterceptors(FilesInterceptor("files", 2, { storage: storage }))
    @UsePipes(TransformInterceptor)
    async setting(@Body() userData, @AuthToken() address: string, @UploadedFiles() files: Express.Multer.File[]) {
        try {
            console.log(userData);
            const addressId = address.toLowerCase();
            return this.usersService.settingUser(userData, addressId, files);
        } catch (error) {
            throw new BadRequestException(error.message);
        }
    }

    @ApiOperation({ summary: "유저확인" })
    @Post("me")
    async test(@AuthToken() address: string) {
        const addressId = address.toLowerCase();
        return this.usersService.findByUser(addressId);
    }
}
