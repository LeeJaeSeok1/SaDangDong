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
import { date_calculate } from "src/plug/caculation.function";

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
    async userInfo(id: string, tab: string, _page: number, _limit: number) {
        try {
            const start = Offset(_page, _limit);

            let information;
            if (tab === "collection") {
                information = await this.collectionRepository.query(`
                SELECT collection.name, collection.description, collection.feature_image, collection.created_at,
                user.name AS user_name, user.profile_image
                FROM collection, user
                WHERE collection.address = "${id}"
                AND collection.address = user.address
                AND collection.archived = 0
                ORDER BY collection.created_at DESC
                LIMIT 100
                `);
            }
            if (tab === "item") {
                information = await this.itemRepository.query(`
                SELECT DISTINCT item.token_id, item.name, item.address, item.image, user.name AS user_name, favorites_relation.count, item.created_at
                FROM item, user, favorites_relation
                WHERE item.owner = "${id}"
                AND item.owner = user.address
                AND item.token_id = favorites_relation.token_id
                AND item.archived = 0
                ORDER BY item.created_at DESC
                LIMIT ${start}, ${_limit}
                `);
            }
            if (tab === "favorites") {
                information = await this.favoritesRepository.query(`
                SELECT DISTINCT item.token_id, item.name, item.address, item.image,
                user.name AS user_name, favorites_relation.count
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

            if (tab === "auction") {
                information = await this.auctionRepository.query(`
                SELECT DISTINCT item.token_id, item.name, item.address, item.image, user.name AS user_name, favorites_relation.count, auction.id AS auction_id, auction.ended_at, auction.started_at
                FROM auction, item, user, favorites_relation
                WHERE item.address = "${id}"
                AND item.owner = user.address
                AND item.token_id = favorites_relation.token_id
                AND auction.token_id = item.token_id
                AND auction.progress = true
                ORDER BY auction.started_at DESC
                `);
                information.forEach((element) => {
                    const ended_at = date_calculate(element.ended_at);
                    element.ended_at = ended_at;
                });
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
