import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Collection } from "src/collections/entities/collection.entity";
import { FavoritesCount } from "src/favorites/entities/favoritesCount.entity";
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
        @InjectRepository(FavoritesCount)
        private favoritesCountRepository: Repository<FavoritesCount>,
    ) {}

    // 모든 아이템 보기
    findItem(): Promise<Item[]> {
        const items = this.itemRepository.find();
        return Object.assign({
            statusCode: 200,
            success: true,
            statusMsg: "아이템들을 불러왔습니다.",
            data: items,
        });
    }

    // 특정아이템 보기
    findByIdItem(token_id: string) {
        const item = this.itemRepository.findOne({ where: { token_id } });
        return Object.assign({
            statusCode: 200,
            success: true,
            statusMsg: "아이템을 불러 왔습니다.",
            data: item,
        });
    }

    // 유저 컬렉션 불러오기
    async findColleciton(address: string) {
        try {
            const collection = await this.collectionRepository.find({
                where: { address: address },
                select: ["name"],
            });
            return Object.assign({
                statusCode: 200,
                success: true,
                statusMsg: "유저의 컬렉션을 불러왔습니다.",
                data: collection,
            });
        } catch (error) {
            throw new BadRequestException(error.message);
        }
    }

    // 아이템 생성
    async createItem(files: Express.Multer.File[], obj, address: string) {
        try {
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

            const favoritesCount = new FavoritesCount();
            favoritesCount.item_id = createItem.token_id;
            favoritesCount.favoritesCount = 0;
            await this.favoritesCountRepository.save(favoritesCount);
            // return createItem;

            return Object.assign({
                statusCode: 201,
                success: true,
                statusMsg: "민팅을 성공 했습니다.",
                data: createItem,
                favoritesCount,
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
            throw new BadRequestException(`본인만 삭제 가능합니다.`);
        }
        await this.itemRepository.delete(id);
        return Object.assign({
            statusCode: 201,
            success: true,
            statusMsg: "아이템을 삭제 했습니다.",
        });
    }
}
