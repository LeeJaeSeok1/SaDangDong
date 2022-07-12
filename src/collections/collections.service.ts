import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
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
    ) {}

    findCollection(): Promise<Collection[]> {
        return this.collectionRepository.find();
    }

    findByOneCollection(id: number): Promise<Collection> {
        return this.collectionRepository.findOne({ where: { id } });
    }

    // async createCollection(createCollectionDto: CreateCollectionDto): Promise<Collection> {
    //     return await this.collectionRepository.save(createCollectionDto);
    // }

    async createCollection(userId: number, createCollectionDto: CreateCollectionDto) {
        const collection = new Collection()
        
    }

    async updateCollection(id: number, updateCollectionDto: UpdateCollectionDto): Promise<Collection> {
        const exisCollection = await this.findByOneCollection(id);

        if (!exisCollection) throw new NotFoundException(`collection not found with the id ${id}`);

        return this.collectionRepository.save(updateCollectionDto);
    }

    async deleteCollection(id: number): Promise<void> {
        await this.collectionRepository.delete(id);
    }
}
