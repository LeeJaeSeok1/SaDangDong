import { Controller, Post, UploadedFiles, UseInterceptors } from "@nestjs/common";
import { ImagesService } from "./images.service";
import * as multerS3 from "multer-s3";
import * as AWS from "aws-sdk";
import { FilesInterceptor } from "@nestjs/platform-express";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import "dotenv/config";

const s3 = new AWS.S3();

@ApiTags("Image")
@Controller("images")
export class ImagesController {
    constructor(private readonly imagesService: ImagesService) {}

    @ApiOperation({ summary: "이미지 업로드", description: "이미지 업로드 페이지" })
    @Post()
    @UseInterceptors(
        FilesInterceptor("images", 3, {
            storage: multerS3({
                s3: s3,
                bucket: process.env.AWS_S3_BUCKET_NAME,
                acl: "public-read",
                key: (req, file, cb) => {
                    cb(null, file.originalname);
                },
            }),
        }),
    )
    async uploadImage(@UploadedFiles() files: Express.Multer.File) {
        return this.imagesService.uploadImage(files);
    }
}
