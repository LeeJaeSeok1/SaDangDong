import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { Collection } from "src/collections/entities/collection.entity";
import { Item } from "src/items/entities/item.entity";
import { User } from "./entities/user.entity";
import { ImageUpload } from "src/images/entities/image.entity";
import { Favorites } from "src/favorites/entities/favorites.entity";
import { Auction } from "src/auctions/entities/auction.entity";
import { Offset } from "src/plug/pagination.function";
import { userName } from "src/plug/userName.function";
import { date_calculate, parse_calculate } from "src/plug/caculation.function";
import { Bidding } from "src/offer/entities/bidding.entity";
import { Favorites_Relation } from "src/favorites/entities/favorites_relation.entity";

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,
        @InjectRepository(Collection)
        private collectionRepository: Repository<Collection>,
        @InjectRepository(Item)
        private itemRepository: Repository<Item>,
        @InjectRepository(Favorites)
        private favoritesRepository: Repository<Favorites>,
        @InjectRepository(Auction)
        private auctionRepository: Repository<Auction>,
        @InjectRepository(Bidding)
        private biddingRepository: Repository<Bidding>,
        @InjectRepository(Favorites_Relation)
        private favoritesrelationRepository: Repository<Favorites_Relation>,
    ) {}

    // sign 페이지
    async sign(address: string) {
        try {
            // console.log("서비스 어드레스", address);
            const existUser = await this.userRepository.findOne({ where: { address } });
            // console.log("existUser", existUser);
            if (!existUser) {
                const user = new User();
                user.address = address;
                user.name = userName();
                await this.userRepository.save(user);
                return Object.assign({
                    statusCode: 201,
                    success: true,
                    statusMsg: "유저가 등록 되었습니다.",
                    data: user,
                });
            }
            return Object.assign({
                statusCode: 201,
                success: true,
                statusMsg: "유저를 불러왔습니다..",
                data: existUser,
            });
        } catch (error) {
            throw new BadRequestException(error.message);
        }
    }

    async getUser(address: string) {
        const user = await this.userRepository.findOne({ where: { address } });
        console.log(user);
        return Object.assign({
            statusCode: 200,
            statusMsg: "유저 정보를 불러왔습니다.",
            data: user,
        });
    }

    findByUser(address: string) {
        return this.userRepository.findOne({ where: { address } });
    }

    // 유저 수정 페이지
    async settingUser(userData, address: string, files: Express.Multer.File[]) {
        try {
            const existUser = await this.findByUser(address);
            if (existUser === null) throw new NotFoundException(`본인만 수정 가능합니다.`);
            if (existUser.address !== address) {
                throw new NotFoundException(`본인만 수정 가능합니다.`);
            }
            const json = userData.fileInfo;
            const obj = JSON.parse(json);
            // 이미지 저장
            const uploadeImages = [];
            let profileImage;
            let element;
            if (files) {
                for (element of files) {
                    const file = new ImageUpload();
                    file.originalName = element.originalname;
                    file.mimeType = element.mimetype;
                    file.url = element.location;
                    uploadeImages.push(file);

                    if (file.originalName === "profile_Img") {
                        profileImage = file.url;
                    }
                }
            }

            existUser.name = obj.name;
            existUser.profile_image = profileImage;
            await this.userRepository.save(existUser);

            return Object.assign({
                statusCode: 201,
                success: true,
                statusMsg: "수정이 완료 됐습니다.",
                data: existUser,
            });
        } catch (error) {
            throw new BadRequestException(error.message);
        }
    }

    // 회원 페이지
    async userInfo(id: string, tab: string, _page: number, _limit: number, address: string) {
        try {
            if (address == `"NOT DEFINED"`) {
                console.log("로그인 한 유저가 없습니다..");
                address = undefined;
            }
            if (!_page) _page = 0;
            if (!_limit) _limit = 12;
            if (!tab) tab == "collection";
            const start = Offset(_page, _limit);

            let information;
            if (tab === "collection") {
                information = await this.collectionRepository.query(`
                SELECT collection.name, collection.description, collection.feature_image, collection.created_at,
                collection.address, user.name AS user_name, user.profile_image
                FROM collection
                    LEFT JOIN user
                    ON collection.address = user.address
                WHERE collection.address = "${id}"
                AND collection.archived = 0
                ORDER BY collection.created_at DESC
                LIMIT 100
                `);
                // LIMIT ${start}, ${_limit}
            }
            if (tab === "item") {
                information = await this.itemRepository.query(`
                SELECT item.token_id, item.name, item.owner, item.image, item.created_at, item.address
                user.name AS user_name, user.address, favorites_relation.count
                FROM item
                    LEFT JOIN user
                    ON item.address = user.address
                    LEFT JOIN favorites_relation
                    ON item.token_id = favorites_relation.token_id
                WHERE item.owner = "${id}"
                AND item.archived = 0
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
                            element.isFavorites = IsFavorites.isFavorites;
                        }
                    }),
                );
            }

            if (tab === "auction") {
                information = await this.auctionRepository.query(`
                SELECT *
                FROM (
                    SELECT item.token_id, item.image, item.name, item.address, item.owner, auction.id AS auction_id,
                    auction.ended_at, auction.progress, user.name AS user_name, favorites_relation.count
                    FROM item
                        LEFT JOIN auction
                        ON item.token_id = auction.token_id
                        LEFT JOIN user
                        ON  item.address = user.address
                        LEFT JOIN favorites_relation
                        ON  item.token_id = favorites_relation.token_id
                    WHERE item.archived = 0
                    AND item.owner = "${id}"
                    ORDER BY auction.ended_at DESC         
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

                            element.isFavorites = result_favorties.isFavorites;
                            element.price = result_bidding.price;
                        }
                    }),
                );
            }

            if (tab === "favorites") {
                information = await this.favoritesRepository.query(`
                SELECT DISTINCT item.token_id, item.name, item.address, item.image,
                user.name AS user_name, user.address, favorites_relation.count
                FROM item, user, favorites, favorites_relation
                WHERE item.owner = "${id}"
                AND item.owner = user.address
                AND item.token_id = favorites.token_id
                AND item.token_id = favorites_relation.token_id
                AND favorites.address = "${id}"
                AND favorites.isFavorites = true
                ORDER BY item.created_at DESC
                `);
            }

            return Object.assign({
                statusCode: 200,
                success: true,
                statusMsg: `유저의 ${tab} 목록을 불러왔습니다.`,
                data: information,
            });
        } catch (error) {
            throw new BadRequestException(error.message);
        }
    }
    // 모든 유저 조회
    async findAll(): Promise<User[]> {
        return this.userRepository.find();
    }
}
