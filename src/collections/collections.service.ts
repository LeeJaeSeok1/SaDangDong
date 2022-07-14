import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { ImageUpload } from "src/images/entities/image.entity";
import { Users } from "src/users/entities/user.entity";
import { Repository } from "typeorm";
import { CreateCollectionDto } from "./dto/createCollection.dto";
import { UpdateCollectionDto } from "./dto/updateCollection.dto";
import { Collection } from "./entities/collection.entity";

@Injectable()
export class CollectionsService {
    constructor(
        @InjectRepository(Collection)
        private collectionRepository: Repository<Collection>,
        @InjectRepository(Users)
        private userRepository: Repository<Users>,
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
    async createdCollection(user: Users, createCollectionDto: CreateCollectionDto) {
        const userId = user.id;
        const createCollection = new Collection();
        createCollection.userId = userId;
        createCollection.name = createCollectionDto.name;
        createCollection.description = createCollectionDto.description;
        createCollection.earning = createCollectionDto.earning;
        createCollection.bennerImage = createCollectionDto.bennerImage;
        createCollection.featureImage = createCollectionDto.featureImage;
        return await this.collectionRepository.save(createCollection);
    }

    // 컬렉션 수정
    async updateCollection(id: number, updateCollectionDto: UpdateCollectionDto, user: Users): Promise<Collection> {
        const exisCollection = await this.findByOneCollection(id);

        if (exisCollection.userId !== user.id) {
            throw new NotFoundException(`본인만 수정 가능합니다.`);
        }
        exisCollection.name = updateCollectionDto.name;
        exisCollection.description = updateCollectionDto.description;
        exisCollection.bennerImage = updateCollectionDto.bennerImage;
        exisCollection.featureImage = updateCollectionDto.featureImage;

        return this.collectionRepository.save(exisCollection);
    }

    // 컬렉션 삭제
    async deleteCollection(id: number, user: Users): Promise<void> {
        const exisCollection = await this.findByOneCollection(id);
        if (exisCollection.userId !== user.id) {
            throw new NotFoundException(`본인만 수정 가능합니다.`);
        }

        await this.collectionRepository.delete(exisCollection);
    }
}
