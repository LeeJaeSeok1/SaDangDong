import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Collection } from "src/collections/entities/collection.entity";
import { User } from "src/users/entities/user.entity";
import { Repository } from "typeorm";
import { CreateItemDto } from "./dto/createItem.dto";
import { UpdateItemDto } from "./dto/updateItem.dto";
import { Item } from "./entities/item.entity";

@Injectable()
export class ItemsService {
    constructor(
        @InjectRepository(Item)
        private itemRepository: Repository<Item>,
        @InjectRepository(Collection)
        private collectionRepository: Repository<Collection>,
    ) {}

    // 모든 아이템 보기
    findItem(): Promise<Item[]> {
        return this.itemRepository.find();
    }

    // 특정아이템 보기
    findByIdItem(id: number): Promise<Item> {
        return this.itemRepository.findOne({ where: { id } });
    }

    // 아이템 생성
    async createItem(user: Users, createItemDto: CreateItemDto): Promise<Item> {
        const userId = user.id;
        const createItem = new Item();
        createItem.name = createItemDto.name;
        createItem.description = createItemDto.description;
        createItem.NFTtoken = createItemDto.NFTtoken;
        createItem.Blockchain = createItemDto.Blockchain;
        createItem.collectionId = createItemDto.collection;
        createItem.userId = userId;
        createItem.owner = userId;
        return await this.itemRepository.save(createItem);
    }

    // 아이템 수정
    // async updateItem(id: number, updateItemDto: UpdateItemDto): Promise<Item> {
    //     const exisItem = await this.findByIdItem(id);

    //     if (!exisItem) throw new NotFoundException(`collection not found with the id ${id}`);

    //     return this.itemRepository.save(updateItemDto);
    // }

    // 아이템 삭제
    async deleteItem(id: number): Promise<void> {
        await this.itemRepository.delete(id);
    }
}
