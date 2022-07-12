import { Controller, Post, UploadedFiles, UseInterceptors } from "@nestjs/common";
import { FilesInterceptor } from "@nestjs/platform-express";
import { ApiBody, ApiConsumes, ApiOperation, ApiTags } from "@nestjs/swagger";
import * as multerS3 from "multer-s3";
import * as AWS from "aws-sdk";
import { ImagesService } from "./images.service";
import { storage } from "src/config/multerS3.config";

const bucketName = process.env.AWS_S3_BUCKET_NAME;

AWS.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_GEGION,
    correctClockSkew: true,
});

const s3 = new AWS.S3();

@ApiTags("Image")
@Controller("api/images")
export class ImagesController {
    constructor(private readonly imagesService: ImagesService) {}

    @ApiOperation({ summary: "이미지 업로드", description: "이미지 업로드 페이지" })
    @ApiConsumes("multipart/form-data")
    @ApiBody({ description: "이미지 업로드" })
    @Post()
    @UseInterceptors(FilesInterceptor("files", 3, { storage: storage }))
    async uploadImage(@UploadedFiles() files: Express.Multer.File[]) {
        return await this.imagesService.uploadImage(files);
    }
}
