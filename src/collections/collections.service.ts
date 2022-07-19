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
    async newCollection(collectionData: CreateCollectionDto, files: Express.Multer.File[], address: string) {
        try {
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
                if (file.originalName === "featureImg") {
                    featureImage = file.url;
                }
            }
            const collection = new Collection();
            collection.address = address;
            collection.benner_image = bennerImage;
            collection.feature_image = featureImage;
            collection.name = collectionData.name;
            collection.description = collectionData.description;
            collection.commission = collectionData.commission;
            return await this.collectionRepository.save(collection);
        } catch (error) {
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
                if (file.originalName === "featureImg") {
                    featureImage = file.url;
                }
            }
            exisCollection.benner_image = bennerImage;
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
        if (exisCollection.user.address !== address) {
            throw new NotFoundException(`본인만 수정 가능합니다.`);
        }
        await this.collectionRepository.delete(exisCollection);
    }
}
