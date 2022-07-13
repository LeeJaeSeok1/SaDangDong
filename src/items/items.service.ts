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

    // 모든 아이템 보기
    findItem(): Promise<Item[]> {
        return this.itemRepository.find();
    }

    // 특정아이템 보기
    findByIdItem(id: number): Promise<Item> {
        return this.itemRepository.findOne({ where: { id } });
    }

    // 아이템 생성
    async createItem(createItemDto: CreateItemDto): Promise<Item> {
        return await this.itemRepository.save(createItemDto);
    }

    // 아이템 수정
    async updateItem(id: number, updateItemDto: UpdateItemDto): Promise<Item> {
        const exisItem = await this.findByIdItem(id);

        if (!exisItem) throw new NotFoundException(`collection not found with the id ${id}`);

        return this.itemRepository.save(updateItemDto);
    }

    // 아이템 삭제
    async deleteItem(id: number): Promise<void> {
        await this.itemRepository.delete(id);
    }
}

// 쿼리 스트링 예제
// 쿼리 매개변수를 제공하려면 /article/findByFilter/bug? google=1&baidu=2 , 다음을 사용할 수 있습니다.

// @Get('/article/findByFilter/bug?')
// async find(
//     @Query('google') google: number,
//     @Query('baidu') baidu: number,
// )
