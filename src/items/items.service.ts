import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CreateItemDto } from "./dto/createItem.dto";
import { UpdateItemDto } from "./dto/updateItem.dto";
import { Item } from "./entities/item.entity";

@Injectable()
export class ItemsService {
    constructor(
        @InjectRepository(Item)
        private itemRepository: Repository<Item>,
    ) {}

    findItem(): Promise<Item[]> {
        return this.itemRepository.find();
    }

    findByIdItem(id: number): Promise<Item> {
        return this.itemRepository.findOne({ where: { id } });
    }

    async createItem(createItemDto: CreateItemDto): Promise<Item> {
        return await this.itemRepository.save(createItemDto);
    }

    async updateItem(id: number, updateItemDto: UpdateItemDto): Promise<Item> {
        const exisItem = await this.findByIdItem(id);

        if (!exisItem) throw new NotFoundException(`collection not found with the id ${id}`);

        return this.itemRepository.save(updateItemDto);
    }

    async deleteItem(id: number): Promise<void> {
        await this.itemRepository.delete(id);
    }
}
