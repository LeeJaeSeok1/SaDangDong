import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ImageUpload } from "./entities/image.entity";
import { ImagesController } from "./images.controller";
import { ImagesService } from "./images.service";

@Module({
    imports: [TypeOrmModule.forFeature([ImageUpload])],
    exports: [TypeOrmModule],
    controllers: [ImagesController],
    providers: [ImagesService],
})
export class ImagesModule {}
