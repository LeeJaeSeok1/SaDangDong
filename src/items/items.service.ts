import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Collection } from "src/collections/entities/collection.entity";
import { Favorites_Relation } from "src/favorites/entities/favorites_relation.entity";
import { ImageUpload } from "src/images/entities/image.entity";
import { User } from "src/users/entities/user.entity";
import { Item } from "./entities/item.entity";
import { Auction } from "src/auctions/entities/auction.entity";
import { date_calculation } from "src/plug/date.function";

@Injectable()
export class ItemsService {
    constructor(
        @InjectRepository(Item)
        private itemRepository: Repository<Item>,
        @InjectRepository(Collection)
        private collectionRepository: Repository<Collection>,
        @InjectRepository(Favorites_Relation)
        private favoritesRelationRepository: Repository<Favorites_Relation>,
        @InjectRepository(User)
        private userRepository: Repository<User>,
        @InjectRepository(Auction)
        private auctionRepository: Repository<Auction>,
    ) {}

    // 모든 아이템 보기
    findItem(): Promise<Item[]> {
        try {
            const items = this.itemRepository.find();
            return Object.assign({
                statusCode: 200,
                success: true,
                statusMsg: "아이템들을 불러왔습니다.",
                data: items,
            });
        } catch (error) {
            throw new BadRequestException(error.message);
        }
    }

    // 특정아이템 보기
    async findByIdItem(token_id: string) {
        try {
            return await this.itemRepository.findOne({ where: { token_id } });
        } catch (error) {
            throw new BadRequestException(error.message);
        }
    }

    // 아이템 상세보기
    async itemDetail(token_id: string) {
        try {
            console.log(token_id);
            const [itemIpfsJson] = await this.itemRepository.query(`
                SELECT item.ipfsJson
                FROM item
                WHERE item.token_id = "${token_id}"
                `);
            console.log(itemIpfsJson);
            const auction = await this.auctionRepository.findOne({ where: { token_id } });
            const limited_time = date_calculation(auction.ended_at);

            const ipfsJson = itemIpfsJson.ipfsJson.split("//")[1];
            console.log(ipfsJson);

            const [item] = await this.itemRepository.query(`
            SELECT DISTINCT item.token_id, item.name, item.description, item.address, item.image, item.ipfsImage,
            item.collection_name, collection.description AS collection_description, 
            user.name AS user_name, user.profile_image, 
            favorites_relation.count AS favorites_count,
            auction.progress AS auction_progress, auction.price AS auction_price, auction.ended_at AS auction_endedAt
            FROM item, user, favorites_relation, collection, auction
            WHERE item.token_id = ${token_id}
            AND item.token_id = auction.token_id
            AND item.collection_name = collection.name
            AND item.owner = user.address
            AND item.token_id = favorites_relation.token_id
            `);
            item.ipfsJson = ipfsJson;
            item.ended_at = limited_time;
            console.log(item);

            return Object.assign({
                statusCode: 200,
                success: true,
                statusMsg: "아이템을 불러 왔습니다.",
                data: item,
            });
        } catch (error) {
            throw new BadRequestException(error.message);
        }
    }

    // 유저 컬렉션 불러오기
    async findColleciton(address: string) {
        try {
            const collection = await this.collectionRepository.query(`
            SELECT collection.name
            FROM collection
            WHERE collection.address = "${address}"`);
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
    async createItem(files: Express.Multer.File[], itemData, address: string) {
        try {
            const json = itemData.itemInfo;
            // console.log(json, "json");
            const obj = JSON.parse(json);
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

            // const newItem = await this.itemRepository.query(`
            // INSERT INTO item (token_id, name, description, collection_name, ipfsJson, ipfsImage, image, address, owner)
            // VALUES ("${obj.token_id}", "${obj.name}", "${obj.description}", "${obj.collection_name}", "${obj.ipfsJson}", "${obj.ipfsImage}", "${element.location}", "${address}", "${address}")
            // `);

            const favoritesCount = new Favorites_Relation();
            favoritesCount.token_id = obj.token_id;
            favoritesCount.count = 0;
            await this.favoritesRelationRepository.save(favoritesCount);
            // return createItem;

            // 0xfb6c2f43d42d39b88fdb964856eb8ec00ff79016;
            // 0xa9f0571052289ed8d731d511ede36ece3df3d0d1;
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
    async updateItem(id: string, itemData, address: string) {
        const exisItem = await this.findByIdItem(id);

        if (!exisItem) throw new NotFoundException(`collection not found with the id ${id}`);

        if (exisItem.owner !== address) {
            throw new BadRequestException("본인만 수정 가능합니다.");
        }

        console.log(itemData);

        exisItem.name = itemData.name;
        exisItem.token_id = itemData.token_id;
        exisItem.description = itemData.description;
        exisItem.collection_name = itemData.collection_id;
        await this.itemRepository.update(id, exisItem);
    }

    // 아이템 삭제
    async deleteItem(id: string, address: string) {
        try {
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
        } catch (error) {
            throw new BadRequestException(error.message);
        }
    }
}
