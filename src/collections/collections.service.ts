import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Auction } from "src/auctions/entities/auction.entity";
import { Favorites } from "src/favorites/entities/favorites.entity";
import { Favorites_Relation } from "src/favorites/entities/favorites_relation.entity";
import { ImageUpload } from "src/images/entities/image.entity";
import { Item } from "src/items/entities/item.entity";
import { Bidding } from "src/offer/entities/bidding.entity";
import { Offer } from "src/offer/entities/offer.entity";
import { date_calculate, parse_calculate } from "src/plug/caculation.function";
import { Offset } from "src/plug/pagination.function";
import { Sell } from "src/sell/entities/sell.entity";
import { Sell_Relation } from "src/sell/entities/sell_relation.entity";
import { User } from "src/users/entities/user.entity";
import { Repository } from "typeorm";
import { Collection } from "./entities/collection.entity";

@Injectable()
export class CollectionsService {
    constructor(
        @InjectRepository(Collection)
        private collectionRepository: Repository<Collection>,
        @InjectRepository(Item)
        private itemRepository: Repository<Item>,
        @InjectRepository(Auction)
        private auctionRepository: Repository<Auction>,
        @InjectRepository(User)
        private userRepository: Repository<User>,
        @InjectRepository(Favorites_Relation)
        private favoritesrelationRepository: Repository<Favorites_Relation>,
        @InjectRepository(Favorites)
        private favoritesRepository: Repository<Favorites>,
        @InjectRepository(Sell_Relation)
        private sellrelationRepository: Repository<Sell_Relation>,
        @InjectRepository(Bidding)
        private biddingRepository: Repository<Bidding>,
        @InjectRepository(Offer)
        private offerRepository: Repository<Offer>,
        @InjectRepository(Sell)
        private sellRepository: Repository<Sell>,
    ) {}

    // 특정 컬렉션 보기
    async findByOneCollection(name: string) {
        try {
            console.log(name);
            const [[collection], [leastoffer], myitem, buyuser] = await Promise.all([
                this.collectionRepository.query(`
                SELECT collection.*, user.name AS user_name, user.profile_image
                FROM collection
                    INNER JOIN user
                    ON collection.address = user.address
                WHERE collection.name = "${name}"
                `),
                this.collectionRepository.query(`
                SELECT min(sell.price) AS least_price
                FROM collection
                    INNER JOIN item
                    ON collection.name = item.collection_name
                    INNER JOIN sell
                    ON item.token_id = sell.token_id
                WHERE collection.name = "${name}"
                GROUP BY collection.name
                `),
                this.itemRepository.query(`
                SELECT *
                FROM item
                    INNER JOIN collection
                    ON item.collection_name = collection.name
                WHERE collection.name = "${name}"
                `),
                this.itemRepository.query(`
                SELECT min(item.token_id)
                FROM item
                    INNER JOIN collection
                    ON item.collection_name = collection.name
                WHERE collection.name = "${name}"
                AND item.address != item.owner
                GROUP BY item.owner
                `),
            ]);

            collection.item_count = myitem.length;
            collection.buyuser_count = buyuser.length;

            if (leastoffer) {
                collection.least_offer = leastoffer.least_price;
            } else {
                collection.least_offer = 0;
            }

            return Object.assign({
                statusCode: 200,
                success: true,
                statusMsg: "컬렉션을 불러왔습니다.",
                data: collection,
            });
        } catch (error) {
            throw new BadRequestException(error.message);
        }
    }

    // 컬렉션 상새보기
    async findOneCollection(name: string, tab: string, _page: number, _limit: number, address: string) {
        try {
            if (address == `"NOT DEFINED"`) {
                console.log("유저가 없습니다.");
                address = undefined;
            }
            if (!_page) _page = 0;
            if (!_limit) _limit = 12;
            if (!tab) tab = "auction";
            console.log(name, tab, _page, _limit);

            const start = Offset(_page, _limit);

            let information;
            if (tab === "item") {
                information = await this.itemRepository.query(`
                SELECT item.token_id, item.address, item.name, item.owner, item.image, item.created_at,
                user.name AS user_name, favorites_relation.count
                FROM item
                    LEFT JOIN collection
                    ON item.collection_name = collection.name
                    LEFT JOIN user
                    ON item.address = user.address
                    LEFT JOIN favorites_relation
                    ON item.token_id = favorites_relation.token_id
                WHERE item.archived = 0
                AND collection.name ="${name}"
                ORDER BY item.created_at DESC
                LIMIT ${start}, ${_limit}
                `);

                await Promise.all(
                    information.map(async (element) => {
                        if (!address) {
                            console.log(address);
                            element.isFavorites = 0;
                        } else {
                            const [IsFavorites] = await this.favoritesRepository.query(`
                            SELECT isFavorites
                            FROM favorites
                            WHERE favorites.token_id = ${element.token_id}
                            AND favorites.address = "${address}"
                            `);
                            if (IsFavorites) {
                                element.isFavorites = IsFavorites.isFavorites;
                            } else {
                                element.isFavorites = 0;
                            }
                        }
                    }),
                );
            }
            if (tab === "auction") {
                information = await this.auctionRepository.query(`
                SELECT *
                FROM (
                    SELECT item.token_id, item.address,item.image, item.name, auction.id AS auction_id,
                    auction.ended_at, auction.progress, user.name AS user_name, favorites_relation.count
                    FROM item
                        LEFT JOIN auction
                        ON item.token_id = auction.token_id
                        LEFT JOIN collection
                        ON item.collection_name = collection.name
                        LEFT JOIN user
                        ON  item.address = user.address
                        LEFT JOIN favorites_relation
                        ON  item.token_id = favorites_relation.token_id
                    WHERE item.archived = 0
                    AND collection.name ="${name}"
                    ORDER BY auction.ended_at ASC
                ) AS g
                WHERE g.progress = true
                LIMIT ${start}, ${_limit}
                `);
                await Promise.all(
                    information.map(async (element) => {
                        const remained_at = date_calculate(element.ended_at);
                        element.remained_at = remained_at;
                        const ended_at = parse_calculate(element.ended_at);
                        element.ended_at = ended_at;

                        if (!address) {
                            console.log(100);
                            const [result_bidding] = await this.biddingRepository.query(`
                            SELECT price
                            FROM bidding
                            WHERE auctionId = ${element.auction_id}
                            `);
                            element.isFavorites = 0;
                            element.price = result_bidding.price;
                        } else {
                            const [[result_favorties], [result_bidding]] = await Promise.all([
                                this.favoritesRepository.query(`
                            SELECT isFavorites
                            FROM favorites             
                            WHERE favorites.token_id = ${element.token_id}
                            AND favorites.address = "${address}"
                            `),
                                this.biddingRepository.query(`
                            SELECT price
                            FROM bidding
                            WHERE auctionId = ${element.auction_id}
                            `),
                            ]);

                            if (result_favorties) {
                                element.isFavorites = result_favorties.isFavorites;
                                element.price = result_bidding.price;
                            } else {
                                element.isFavorites = 0;
                                element.price = result_bidding.price;
                            }
                        }
                    }),
                );
            }

            return Object.assign({
                statusCode: 200,
                success: true,
                statusMsg: "컬렉션을 불러왔습니다.",
                data: information,
            });
        } catch (error) {
            console.log(error.message);
            throw new BadRequestException(error.message);
        }
    }

    // 컬렉션 생성
    async newCollection(collectionData, files: Express.Multer.File[], address: string) {
        try {
            if (address == `"NOT DEFINED"`) {
                return Object.assign({
                    statusCode: 400,
                    success: true,
                    statusMsg: `메타마스크에 연결하십시오.`,
                });
            }
            const json = collectionData.fileInfo;

            const obj = JSON.parse(json);
            console.log(obj);
            const [exisCollection] = await this.collectionRepository.query(`
            SELECT *
            FROM collection
            WHERE name = "${obj.name}"
            `);

            console.log(exisCollection);

            if (exisCollection) {
                throw new BadRequestException(`${obj.name}은 이미 있는 컬렉션 입니다.`);
            }

            const uploadeImages = [];

            let featureImage;
            let bannerImage;
            let element;

            if (files) {
                for (element of files) {
                    const file = new ImageUpload();
                    file.originalName = element.originalname;
                    file.mimeType = element.mimetype;
                    file.url = element.location;
                    uploadeImages.push(file);

                    if (file.originalName === "bannerImg") {
                        bannerImage = file.url;
                    }
                    if (file.originalName === "featuredImg") {
                        featureImage = file.url;
                    }
                }
            }

            console.log(obj);

            const collection = new Collection();
            collection.address = address;
            collection.banner_image = bannerImage;
            collection.feature_image = featureImage;
            collection.name = obj.name;
            collection.description = obj.desc;
            collection.commission = obj.commission;
            console.log(collection);
            await this.collectionRepository.save(collection);

            return Object.assign({
                statusCode: 201,
                success: true,
                statusMsg: "컬렉션을 생성했습니다.",
                data: collection,
            });
        } catch (error) {
            console.log("서비스", error.message);
            throw new BadRequestException(error.message);
        }
    }

    // 컬렉션 수정
    async updateCollection(name: string, updateData, address: string, files: Express.Multer.File[]) {
        try {
            if (address == `"NOT DEFINED"`) {
                return Object.assign({
                    statusCode: 400,
                    success: true,
                    statusMsg: `메타마스크에 연결하십시오.`,
                });
            }
            const [exisCollection] = await this.collectionRepository.query(`
            SELECT *
            FROM collection
            WHERE name = "${name}"
            `);
            console.log(exisCollection);
            if (exisCollection.address !== address) {
                throw new NotFoundException(`본인만 수정 가능합니다.`);
            }

            const json = updateData.fileInfo;

            const obj = JSON.parse(json);

            const uploadeImages = [];

            let featureImage;
            let bannerImage;
            let element;

            if (files) {
                for (element of files) {
                    const file = new ImageUpload();
                    file.originalName = element.originalname;
                    file.mimeType = element.mimetype;
                    file.url = element.location;
                    uploadeImages.push(file);

                    if (file.originalName === "bannerImg") {
                        bannerImage = file.url;
                    }
                    if (file.originalName === "featuredImg") {
                        featureImage = file.url;
                    }
                }
            }

            exisCollection.banner_image = bannerImage;
            exisCollection.feature_image = featureImage;
            exisCollection.name = obj.name;
            exisCollection.description = obj.desc;
            exisCollection.commission = obj.commission;
            await this.collectionRepository.update(name, exisCollection);

            return Object.assign({
                statusCode: 201,
                success: true,
                statusMsg: "컬렉션을 수정했습니다.",
                data: exisCollection,
            });
        } catch (error) {
            throw new BadRequestException(error.message);
        }
    }

    // 컬렉션 삭제
    async deleteCollection(name: string, address: string) {
        try {
            if (address == `"NOT DEFINED"`) {
                return Object.assign({
                    statusCode: 400,
                    success: true,
                    statusMsg: `메타마스크에 연결하십시오.`,
                });
            }
            console.log("서비스 아이디 확인", address);
            console.log("컬럼삭제 서비스 아이디 확인", name);
            const [exisCollection] = await this.collectionRepository.query(`
            SELECT *
            FROM collection
            WHERE name = "${name}"
            `);
            console.log("서비스, 컬럼확인", exisCollection);
            if (exisCollection.address !== address) {
                throw new NotFoundException(`본인만 삭제 가능합니다.`);
            }

            await this.collectionRepository.query(`
            UPDATE collection SET archived_at = NOW(), archived = 1 WHERE name = "${name}"
            `);

            return Object.assign({
                statusCode: 201,
                success: true,
                statusMsg: "컬렉션을 삭제했습니다.",
            });
        } catch (error) {
            console.log("서비스 캐치에러", error.message);
            throw new BadRequestException(error.message);
        }
    }
}
