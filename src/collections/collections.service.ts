import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { ImageUpload } from "src/images/entities/image.entity";
import { User } from "src/users/entities/user.entity";
import { Repository } from "typeorm";
import { CreateCollectionDto } from "./dto/createCollection.dto";
import { UpdateCollectionDto } from "./dto/updateCollection.dto";
import { Collection } from "./entities/collection.entity";

@Injectable()
export class CollectionsService {
    constructor(
        @InjectRepository(Collection)
        private collectionRepository: Repository<Collection>,
        @InjectRepository(User)
        private userRepository: Repository<User>,
        @InjectRepository(ImageUpload)
        private readonly imagesReposiroty: Repository<ImageUpload>,
    ) {}

    // 모든 컬렉션 보기
    findCollection(): Promise<Collection[]> {
        return this.collectionRepository.find();
    }

    // 특정 컬렉션 보기
    findByOneCollection(id: number): Promise<Collection> {
        return this.collectionRepository.findOne({ where: { id } });
    }

    // 컬렉션 생성
    async newCollection(collectionData, files: Express.Multer.File[], address: string) {
        try {
            console.log("서비스 컬렉션 데이터", collectionData);
            console.log("files", files);
            console.log("서비스 address", address);
            const json = collectionData.fileInfo;
            console.log(1);
            console.log(json, "json");
            const obj = JSON.parse(json);
            console.log(obj, "obj");
            const uploadeImages = [];
            let featureImage;
            let bennerImage;
            let element;
            for (element of files) {
                const file = new ImageUpload();
                file.originalName = element.originalname;
                file.mimeType = element.mimetype;
                file.url = element.location;
                uploadeImages.push(file);

                if (file.originalName === "bannerImg") {
                    bennerImage = file.url;
                }
                if (file.originalName === "featuredImg") {
                    featureImage = file.url;
                }
            }
            const collection = new Collection();
            collection.address = address;
            collection.banner_image = bennerImage;
            collection.feature_image = featureImage;
            collection.name = obj.name;
            collection.description = obj.desc;
            collection.commission = obj.commission;
            return await this.collectionRepository.save(collection);
        } catch (error) {
            console.log("서비스", error.message);
            throw new BadRequestException(error.message);
        }
    }

    // 컬렉션 수정
    async updateCollection(id: number, updateData, address: string, files: Express.Multer.File[]) {
        try {
            const exisCollection = await this.findByOneCollection(id);
            if (exisCollection.address !== address) {
                throw new NotFoundException(`본인만 수정 가능합니다.`);
            }
            const uploadeImages = [];
            let featureImage;
            let bannerImage;
            let element;
            for (element of files) {
                const file = new ImageUpload();
                file.originalName = element.originalname;
                file.mimeType = element.mimetype;
                file.url = element.location;
                uploadeImages.push(file);

                if (file.originalName === "bannerImg") {
                    bannerImage = file.url;
                }
                if (file.originalName === "featureImg") {
                    featureImage = file.url;
                }
            }
            exisCollection.banner_image = bannerImage;
            exisCollection.feature_image = featureImage;
            exisCollection.name = updateData.name;
            exisCollection.description = updateData.description;
            exisCollection.commission = updateData.commission;
            return await this.collectionRepository.save(exisCollection);
        } catch (error) {
            throw new BadRequestException(error.message);
        }
    }

    // 컬렉션 삭제
    async deleteCollection(id: number, address: string) {
        const exisCollection = await this.findByOneCollection(id);
        if (exisCollection.address !== address) {
            throw new NotFoundException(`본인만 수정 가능합니다.`);
        }
        await this.collectionRepository.delete(exisCollection);
    }
}
