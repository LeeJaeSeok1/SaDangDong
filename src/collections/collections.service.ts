import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CreateCollectionDto } from "./dto/createCollection.dto";
import { UpdateCollectionDto } from "./dto/updateCollection.dto";
import { Collection } from "./entities/collection.entity";

@Injectable()
export class CollectionsService {
    constructor(
        @InjectRepository(Collection)
        private collectionRepository: Repository<Collection>,
    ) {}

    findCollection(): Promise<Collection[]> {
        return this.collectionRepository.find();
    }

    findByOneCollection(id: number): Promise<Collection> {
        return this.collectionRepository.findOne({ where: { id } });
    }

    async createCollection(createCollectionDto: CreateCollectionDto): Promise<Collection> {
        return await this.collectionRepository.save(createCollectionDto);
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
