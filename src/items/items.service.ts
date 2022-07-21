import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { String } from "aws-sdk/clients/apigateway";
import { Collection } from "src/collections/entities/collection.entity";
import { ImageUpload } from "src/images/entities/image.entity";
import { User } from "src/users/entities/user.entity";
import { Repository } from "typeorm";
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
    findByIdItem(token_id: String) {
        return this.itemRepository.findOne({ where: { token_id } });
    }

    // 유저 컬렉션 불러오기
    async findColleciton(address: string) {
        try {
            let collection = await this.collectionRepository.find({
                where: { address: address },
                select: ["name"],
            });
            console.log(collection);
            return collection;
        } catch (error) {
            throw new BadRequestException(error.message);
        }
    }

    // 아이템 생성
    async createItem(files: Express.Multer.File[], obj, address: string) {
        try {
            // console.log("서비스 아이템 데이터", itemData);
            console.log("files", files);
            console.log("서비스 address", address);

            const uploadeImages = [];
            let itemImage;
            let element;
            if (files) {
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
            }
            const createItem = new Item();
            createItem.token_id = obj.token_id;
            createItem.name = obj.name;
            createItem.description = obj.description;
            createItem.collection_id = obj.collection_id;
            createItem.image = itemImage;
            createItem.address = address;
            createItem.owner = address;
            await this.itemRepository.save(createItem);
        } catch (error) {
            console.log("아이템 생성 서비스 에러", error.message);
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
    async deleteItem(id: string, address: string) {
        const exisItem = await this.findByIdItem(id);
        if (exisItem.owner !== address) {
            throw new NotFoundException(`본인만 수정 가능합니다.`);
        }
        await this.itemRepository.delete(id);
    }
}
