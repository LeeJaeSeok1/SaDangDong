import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { String } from "aws-sdk/clients/apigateway";
import { createWriteStream } from "fs";
import { Collection } from "src/collections/entities/collection.entity";
import { FavolitesCount } from "src/favorites/entities/favoritesCount.entity";
import { ImageUpload } from "src/images/entities/image.entity";
import { Repository } from "typeorm";
import { Item } from "./entities/item.entity";

@Injectable()
export class ItemsService {
    constructor(
        @InjectRepository(Item)
        private itemRepository: Repository<Item>,
        @InjectRepository(Collection)
        private collectionRepository: Repository<Collection>,
        @InjectRepository(FavolitesCount)
        private favoritesCountRepository: Repository<FavolitesCount>,
    ) {}

    // 모든 아이템 보기
    findItem(): Promise<Item[]> {
        return this.itemRepository.find();
    }

    // 특정아이템 보기
    findByIdItem(token_id: string) {
        return this.itemRepository.findOne({ where: { token_id } });
    }

    // 유저 컬렉션 불러오기
    async findColleciton(address: string) {
        try {
            const collection = await this.collectionRepository.find({
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
            console.log("files", files);
            console.log("서비스 address", address);
            console.log("서비스 obj", obj);

            const uploadeImages = [];
            let element;
            if (files) {
                for (element of files) {
                    const file = new ImageUpload();
                    file.originalName = element.originalname;
                    file.mimeType = element.mimetype;
                    file.url = element.location;
                    uploadeImages.push(file);
                }
            }
            const createItem = new Item();
            createItem.token_id = obj.token_id;
            createItem.name = obj.name;
            createItem.description = obj.description;
            createItem.collection_name = obj.collection_id;
            createItem.ipfsJson = obj.ipfsJson;
            createItem.ipfsImage = obj.ipfsImage;
            createItem.image = element.location;
            createItem.address = address;
            createItem.owner = address;
            await this.itemRepository.save(createItem);

            const favolitesCount = new FavolitesCount();
            favolitesCount.item_id = createItem.token_id;
            favolitesCount.favoritesCount = 0;
            await this.favoritesCountRepository.save(favolitesCount);
            // return createItem;

            return Object.assign({
                statusCode: 201,
                statusMsg: "민팅을 성공 했습니다.",
                data: createItem,
                favolitesCount,
            });
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
