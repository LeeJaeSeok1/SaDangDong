import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Collection } from "src/collections/entities/collection.entity";
import { ImageUpload } from "src/images/entities/image.entity";
import { User } from "src/users/entities/user.entity";
import { Repository } from "typeorm";
import { CreateItemDto } from "./dto/createItem.dto";
import { Item } from "./entities/item.entity";

@Injectable()
export class ItemsService {
    constructor(
        @InjectRepository(Item)
        private itemRepository: Repository<Item>,
        @InjectRepository(Collection)
        private collectionRepository: Repository<Collection>,
        @InjectRepository(User)
        private userRepository: Repository<User>,
    ) {}

    // 모든 아이템 보기
    findItem(): Promise<Item[]> {
        return this.itemRepository.find();
    }

    // 특정아이템 보기
    findByIdItem(id: number) {
        // return this.itemRepository.findOne({ where: { id } });
    }

    // 유저 컬렉션 불러오기
    async findColleciton(address: string) {
        try {
            let collection = await this.collectionRepository.find({ where: { address: address } });
            return collection;
        } catch (error) {
            throw new BadRequestException(error.message);
        }
    }

    // 아이템 생성
    async createItem(files: Express.Multer.File[], itemData: CreateItemDto, address: string) {
        try {
            const uploadeImages = [];
            let itemImage;
            let element;
            for (element of files) {
                const file = new ImageUpload();
                file.originalName = element.originalname;
                file.mimeType = element.mimetype;
                file.url = element.location;
                uploadeImages.push(file);

                if (file.originalName === "itemImg") {
                    itemImage = file.url;
                }
            }
            const createItem = new Item();
            createItem.token_id = itemData.token_id;
            createItem.name = itemData.name;
            createItem.description = itemData.description;
            createItem.collection_id = itemData.collection_id;
            createItem.image = itemImage;
            createItem.address = address;
            createItem.owner = address;
            return await this.itemRepository.save(createItem);
        } catch (error) {
            throw new BadRequestException(error.message);
        }
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
