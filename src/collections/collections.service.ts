import { Injectable, NotFoundException } from "@nestjs/common";
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
    async createdCollection(createCollectionDto: CreateCollectionDto, address: string) {
        try {
            const createCollection = new Collection();
            createCollection.user.address = address;
            createCollection.name = createCollectionDto.name;
            createCollection.description = createCollectionDto.description;
            createCollection.commission = createCollectionDto.commission;
            createCollection.benner_image = createCollectionDto.benner_image;
            createCollection.feature_image = createCollectionDto.feature_image;
            return await this.collectionRepository.save(createCollection);
        } catch (error) {
            throw new NotFoundException(error);
        }
    }

    // 컬렉션 생성 테스트
    async newCollection(createCollectionDto: CreateCollectionDto, address: string) {
        const user = new User();
        user.address = address;

        const collection = new Collection();
        collection.name = createCollectionDto.name;
        collection.description = createCollectionDto.description;
        collection.commission = createCollectionDto.commission;
        collection.benner_image = createCollectionDto.benner_image;
        collection.feature_image = createCollectionDto.feature_image;
        collection.user = user;
        await this.collectionRepository.save(collection);

        return collection;
    }

    // 컬렉션 수정
    async updateCollection(id: number, updateCollectionDto: UpdateCollectionDto, address: string) {
        try {
            const exisCollection = await this.findByOneCollection(id);
            if (exisCollection.user.address !== address) {
                throw new NotFoundException(`본인만 수정 가능합니다.`);
            }
            exisCollection.name = updateCollectionDto.name;
            exisCollection.description = updateCollectionDto.description;
            exisCollection.benner_image = updateCollectionDto.benner_image;
            exisCollection.feature_image = updateCollectionDto.feature_image;
            return this.collectionRepository.save(exisCollection);
        } catch (error) {
            throw new NotFoundException(error);
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
