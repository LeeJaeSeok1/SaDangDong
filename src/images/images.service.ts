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

    async uploadImage(files: Express.Multer.File[], createImageDto: CreateImageDto) {
        const uploadeImages = [];
        let element;
        for (element of files) {
            const file = new ImageUpload();
            file.originalName = element.originalname;
            file.mimeType = element.mimetype;
            file.url = element.location;
            file.target = createImageDto.target;
            uploadeImages.push(file);
        }
        return await this.imagesReposiroty.save(uploadeImages);
    }
}
