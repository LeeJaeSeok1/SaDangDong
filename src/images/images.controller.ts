import { Controller, Post, UploadedFiles, UseInterceptors } from "@nestjs/common";
import { FileInterceptor, FilesInterceptor } from "@nestjs/platform-express";
import { ApiBody, ApiConsumes, ApiOperation, ApiTags } from "@nestjs/swagger";
import { ImagesService } from "./images.service";
import { storage } from "src/config/multerS3.config";

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
                file: {
                    type: "string",
                    format: "binary",
                },
            },
        },
    })
    @UseInterceptors(FileInterceptor("file"))
    @Post()
    @UseInterceptors(FilesInterceptor("files", 3, { storage: storage }))
    async uploadImage(@UploadedFiles() files: Express.Multer.File[]) {
        return await this.imagesService.uploadImage(files);
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
