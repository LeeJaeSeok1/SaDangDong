import { BadRequestException, Body, Controller, Post, UploadedFiles, UseInterceptors } from "@nestjs/common";
import { FilesInterceptor } from "@nestjs/platform-express";
import { ApiBody, ApiConsumes, ApiOperation, ApiTags } from "@nestjs/swagger";
import { ImagesService } from "./images.service";
import { storage } from "src/config/multerS3.config";
import { CreateImageDto } from "./dto/createImage.dto";

@ApiTags("Image")
@Controller("api/images")
export class ImagesController {
    constructor(private readonly imagesService: ImagesService) {}

    @ApiOperation({ summary: "이미지 업로드", description: "이미지 업로드 페이지" })
    @ApiConsumes("multipart/form-data")
    @ApiBody({
        schema: {
            type: "object",
            properties: {
                files: {
                    type: "array",
                    items: {
                        type: "string",
                        format: "binary",
                    },
                },
                target: {
                    example: "logoImage",
                },
            },
        },
    })
    @Post()
    @UseInterceptors(FilesInterceptor("files", 3, { storage: storage }))
    async uploadImage(@UploadedFiles() files: Express.Multer.File[], @Body() fileInfo: CreateImageDto) {
        console.log("여긴 뜨나?");
        try {
            console.log("이미지 콘솔", files);
            console.log("파일정보", fileInfo);
            return await this.imagesService.uploadImage(files, fileInfo);
        } catch (error) {
            throw new BadRequestException(error.message);
        }
    }

    //     @ApiOperation({ summary: "이미지 업로드", description: "이미지 업로드 페이지" })
    //     @ApiConsumes("multipart/form-data")
    //     @ApiBody({ description: "이미지 업로드" })
    //     @Post()
    //     @UseInterceptors(
    //         FilesInterceptor({ name: "logoImage" }, { name: "bennerImage" }, { name: "fearureImage" }, 3, {
    //             storage: storage,
    //         }),
    //     )
    //     async uploadImage(@UploadedFiles() files: Express.Multer.File[]) {
    //         return await this.imagesService.uploadImage(files);
    //     }
}
