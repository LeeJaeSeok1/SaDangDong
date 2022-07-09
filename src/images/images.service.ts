import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { ImageUpload } from "./entities/image.entity";

@Injectable()
export class ImagesService {
    constructor(
        @InjectRepository(ImageUpload)
        private readonly imagesReposiroty: Repository<ImageUpload>,
    ) {}

    async uploadImage(files: Express.Multer.File[]) {
        const uploadeImages = [];
        for (const element of files) {
            const file = new ImageUpload();
            file.originalName = element.originalname;
            file.mimeType = element.mimetype;
            file.url = element.location;

            uploadeImages.push(file);
        }
        return await this.imagesReposiroty.save(uploadeImages);
    }
}
