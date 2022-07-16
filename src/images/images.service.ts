import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CreateImageDto } from "./dto/createImage.dto";
import { ImageUpload } from "./entities/image.entity";

@Injectable()
export class ImagesService {
    constructor(
        @InjectRepository(ImageUpload)
        private readonly imagesReposiroty: Repository<ImageUpload>,
    ) {}

    async uploadImage(files: Express.Multer.File[]) {
        try {
            const uploadeImages = [];
            let element;
            for (element of files) {
                const file = new ImageUpload();
                file.originalName = element.originalname;
                file.mimeType = element.mimetype;
                file.url = element.location;
                uploadeImages.push(file);
            }
            console.log("여긴 이미지 서비스");
            console.log("originalname", element.originalName);
            console.log("mimetype", element.mimetype);
            console.log("location", element.location);
            return await this.imagesReposiroty.save(uploadeImages);
        } catch (error) {
            console.log("error", error);
        }
    }
}
