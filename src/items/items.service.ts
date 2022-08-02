import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Collection } from "src/collections/entities/collection.entity";
import { Favorites_Relation } from "src/favorites/entities/favorites_relation.entity";
import { ImageUpload } from "src/images/entities/image.entity";
import { User } from "src/users/entities/user.entity";
import { Item } from "./entities/item.entity";
import { Auction } from "src/auctions/entities/auction.entity";
import { date_calculate, parse_Kcalculate } from "src/plug/caculation.function";
import { Offer } from "src/offer/entities/offer.entity";
import { Bidding } from "src/offer/entities/bidding.entity";
import { UpdateItemDto } from "./dto/updateItem.dto";

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
        @InjectRepository(Offer)
        private offerRepository: Repository<Offer>,
        @InjectRepository(Bidding)
        private biddingRepository: Repository<Bidding>,
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
    async itemDetail(token_id: string, address: string) {
        try {
            if (address == `"NOT DEFINED"`) {
                console.log("로그인 한 유저가 없습니다..");
                address = undefined;
            }

            const [itemIpfsJson] = await this.itemRepository.query(`
                SELECT item.ipfsJson
                FROM item
                WHERE item.token_id = "${token_id}"
                `);

            const [auction] = await this.auctionRepository.query(`
            SELECT *
            FROM auction
            WHERE token_id = "${token_id}"
            AND progress = true
            `);

            const ipfsJson = itemIpfsJson.ipfsJson.split("//")[1];
            const [favorites] = await this.favoritesRelationRepository.query(`
            SELECT isFavorites
            FROM favorites
            WHERE favorites.token_id = "${token_id}"
            AND favorites.address = "${address}"
            `);
            let isFavorites;
            if (!favorites) {
                isFavorites = false;
            } else {
                isFavorites = favorites.isFavorites;
            }

            if (auction === undefined) {
                const [check_auction] = await this.auctionRepository.query(`
                SELECT *
                FROM auction
                WHERE auction.token_id = ${token_id}
                ORDER BY transaction_at DESC
                `);

                const [item] = await this.itemRepository.query(`
                SELECT DISTINCT item.token_id, item.name, item.description, item.address, item.image, item.ipfsImage,
                item.collection_name, collection.description AS collection_description, 
                user.name AS user_name, user.profile_image, item.owner, item.hashdata,
                favorites_relation.count AS favorites_count
                FROM item, user, favorites_relation, collection
                WHERE item.token_id = ${token_id}
                AND item.collection_name = collection.name
                AND item.address = user.address
                AND item.token_id = favorites_relation.token_id
                `);

                const [owner_user] = await this.userRepository.query(`
                SELECT *
                FROM user
                WHERE user.address = "${item.owner}"
                `);

                item.ipfsJson = ipfsJson;
                item.favorites = isFavorites;
                item.auction_id = 0;
                item.owner_name = owner_user.name;
                item.offers = [];
                if (check_auction) {
                    item.transaction_at = check_auction.transaction_at;
                    item.transaction = check_auction.transaction;
                } else {
                    item.transaction_at = new Date();
                    item.transaction = 1;
                }

                return Object.assign({
                    statusCode: 200,
                    success: true,
                    statusMsg: "아이템을 불러 왔습니다.",
                    data: item,
                });
            }
            const remained_at = date_calculate(auction.ended_at);

            const [item] = await this.itemRepository.query(`
            SELECT item.token_id, item.name, item.description, item.address, item.image, item.ipfsImage,
            item.collection_name, collection.description AS collection_description, item.owner,
            user.name AS user_name, user.profile_image, auction.transaction_at, auction.transaction,
            favorites_relation.count AS favorites_count,
            auction.progress AS auction_progress, auction.price AS auction_price, auction.ended_at AS auction_endedAt,
            auction.id AS auction_id, item.hashdata
            FROM item, user, favorites_relation, collection, auction
            WHERE item.token_id = ${token_id}
            AND item.token_id = auction.token_id
            AND item.collection_name = collection.name
            AND item.address = user.address
            AND item.token_id = favorites_relation.token_id
            AND auction.progress = true
            `);

            const [owner_user] = await this.userRepository.query(`
            SELECT *
            FROM user
            WHERE user.address = "${item.owner}"
            `);
            item.owner_name = owner_user.name;
            item.ipfsJson = ipfsJson;
            item.remained_at = remained_at;
            item.favorites = isFavorites;

            const [bidding] = await this.biddingRepository.query(`
            SELECT *
            FROM bidding
            WHERE auctionId = ${auction.id}
            `);

            const offers = await this.offerRepository.query(`
                SELECT offer.price, offer.created_at, offer.auctionId, offer.address, user.name  
                FROM offer
                    INNER JOIN auction
                    ON offer.auctionId = auction.id
                    INNER JOIN user
                    ON offer.address = user.address
                WHERE offer.auctionId = ${auction.id}
                ORDER BY created_at ASC
            `);
            offers.forEach((element) => {
                const Kdate = parse_Kcalculate(element.created_at, 9);
                element.created_at = Kdate;
            });
            item.bidding_price = bidding.price;
            item.offers = offers;

            return Object.assign({
                statusCode: 200,
                success: true,
                statusMsg: "아이템을 불러 왔습니다.",
                data: item,
            });
        } catch (error) {
            console.log(error.message);
            throw new BadRequestException(error.message);
        }
    }

    // 유저 컬렉션 불러오기
    async findColleciton(address: string) {
        try {
            const collection = await this.collectionRepository.query(`
            SELECT collection.name
            FROM collection
            WHERE collection.address = "${address}"
            AND collection.archived = 0`);
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

    // 임시아이템 생성
    async tempItem(token_id: string) {
        const item = new Item();
        item.token_id = token_id;
        item.archived = 1;

        return this.itemRepository.save(item);
    }

    // 아이템 생성
    async createItem(files: Express.Multer.File[], itemData, address: string) {
        try {
            if (address == `"NOT DEFINED"`) {
                return Object.assign({
                    statusCode: 400,
                    success: true,
                    statusMsg: `메타마스크에 연결하십시오.`,
                });
            }
            const json = itemData.itemInfo;
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
            createItem.collection_name = obj.collection_name;
            createItem.ipfsJson = obj.ipfsJson;
            createItem.ipfsImage = obj.ipfsImage;
            createItem.image = element.location;
            createItem.address = address;
            createItem.owner = address;
            createItem.hashdata = obj.hashdata;
            createItem.archived = 0;
            await this.itemRepository.update(obj.token_id, createItem);

            const favoritesCount = new Favorites_Relation();
            favoritesCount.token_id = obj.token_id;
            favoritesCount.count = 0;
            await this.favoritesRelationRepository.save(favoritesCount);

            return Object.assign({
                statusCode: 201,
                success: true,
                statusMsg: "민팅을 성공 했습니다.",
                data: { createItem, favoritesCount },
            });
        } catch (error) {
            console.log("아이템 생성 서비스 에러", error.message);
            throw new BadRequestException(error.message);
        }
    }

    // 아이템 수정
    async updateItem(id: string, itemData: UpdateItemDto, address: string) {
        if (address == `"NOT DEFINED"`) {
            return Object.assign({
                statusCode: 400,
                success: true,
                statusMsg: `메타마스크에 연결하십시오.`,
            });
        }

        const exisItem = await this.findByIdItem(id);

        if (!exisItem) throw new NotFoundException(`collection not found with the id ${id}`);

        if (exisItem.owner !== address) {
            throw new BadRequestException("본인만 수정 가능합니다.");
        }

        exisItem.name = itemData.name;
        exisItem.description = itemData.description;
        exisItem.collection_name = itemData.collection_name;
        await this.itemRepository.update(id, exisItem);

        return Object.assign({
            statusCode: 201,
            success: true,
            statusMsg: "아이템을 수정 했습니다. 했습니다.",
            data: exisItem,
        });
    }

    // 아이템 삭제
    async deleteItem(id: string, address: string) {
        try {
            if (address == `"NOT DEFINED"`) {
                return Object.assign({
                    statusCode: 400,
                    success: true,
                    statusMsg: `메타마스크에 연결하십시오.`,
                });
            }
            const exisItem = await this.findByIdItem(id);
            if (exisItem.owner !== address) {
                throw new BadRequestException(`본인만 삭제 가능합니다.`);
            }
            await this.itemRepository.query(`
            UPDATE item SET archived_at = NOW(), archived = 1 WHERE token_id = "${id}"
            `);
            return Object.assign({
                statusCode: 201,
                success: true,
                statusMsg: "아이템을 삭제 했습니다.",
            });
        } catch (error) {
            throw new BadRequestException(error.message);
        }
    }

    async findLastItem() {
        try {
            const [item] = await this.itemRepository.query(`
            SELECT token_id
            FROM item
            ORDER BY created_at DESC
            LIMIT 1;
            `);

            if (item) {
                console.log("마지막 아이템을 불러왔습니다.", item.token_id);
                return Object.assign({
                    statusCode: 201,
                    success: true,
                    statusMsg: "마지막 아이템 아이디를 불러왔습니다.",
                    data: Number(item.token_id) + 1,
                });
            }

            return Object.assign({
                statusCode: 201,
                success: true,
                statusMsg: "마지막 아이템 아이디 불러왔습니다.",
                data: 1,
            });
        } catch (error) {
            throw new BadRequestException(error.message);
        }
    }
}
