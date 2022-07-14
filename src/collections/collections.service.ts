import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
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
    // 컬렉션에 유저 아이디 등록 됨
    async createdCollection(user: Users, createCollectionDto: CreateCollectionDto) {
        const userId = user.id;
        const createCollection = new Collection();
        createCollection.userId = userId;
        createCollection.name = createCollectionDto.name;
        createCollection.description = createCollectionDto.description;
        createCollection.earning = createCollectionDto.earning;
        createCollection.bennerImage = createCollectionDto.bennerImage;
        createCollection.fearureImage = createCollectionDto.fearureImage;
        return await this.collectionRepository.save(createCollection);
    }

    // async newCollection(user: Users, collectionData: CreateCollectionDto): Promise<Collection> {
    //     const owner = user;
    //     const { name, description, bennerImage, fearureImage, earning } = collectionData;

    //     const collection = this.collectionRepository.create({
    //         name,
    //         description,
    //         bennerImage,
    //         fearureImage,
    //         earning,
    //     });
    //     await this.collectionRepository.save(collection, owner);
    //     return collection;
    // }

    // 업데이트 컬렉션
    async updateCollection(id: number, updateCollectionDto: UpdateCollectionDto): Promise<Collection> {
        const exisCollection = await this.findByOneCollection(id);

        if (!exisCollection) throw new NotFoundException(`collection not found with the id ${id}`);

        return this.collectionRepository.save(updateCollectionDto);
    }

    // 컬렉션 삭제
    async deleteCollection(id: number): Promise<void> {
        await this.collectionRepository.delete(id);
    }
}
