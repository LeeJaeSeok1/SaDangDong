import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Auction } from "src/auctions/entities/auction.entity";
import { ImageUpload } from "src/images/entities/image.entity";
import { Item } from "src/items/entities/item.entity";
import { date_calculate } from "src/plug/caculation.function";
import { Offset } from "src/plug/pagination.function";
import { Repository } from "typeorm";
import { Collection } from "./entities/collection.entity";

@Injectable()
export class CollectionsService {
    constructor(
        @InjectRepository(Collection)
        private collectionRepository: Repository<Collection>,
        @InjectRepository(Auction)
        private auctionRepository: Repository<Auction>,
        @InjectRepository(Item)
        private itemRepository: Repository<Item>,
    ) {}

    // 모든 컬렉션 보기
    findCollection(): Promise<Collection[]> {
        return this.collectionRepository.find();
    }

    // 특정 컬렉션 보기
    findByOneCollection(name: string): Promise<Collection> {
        return this.collectionRepository.findOne({ where: { name } });
    }

    // 컬렉션 상새보기
    async findOneCollection(id: string, tab: string, _page: number, _limit: number) {
        try {
            const start = Offset(_page, _limit);

            console.log("컬렉션 서비스 아이디", id);
            // const collectionInfo = await this.collectionRepository.findOne({ where: { name: id } });
            const [collectionInfo] = await this.collectionRepository.query(`
            SELECT collection.name, collection.description, collection.feature_image, collection.created_at, user.name AS user_name, user.profile_image
            FROM collection, user
            WHERE collection.address = user.address
            AND collection.name = "${id}"
            `);

            let information;
            if (tab === "item") {
                information = await this.itemRepository.query(`
                SELECT DISTINCT item.token_id, item.name, item.owner, item.image, user.name AS user_name, favorites_relation.count, item.created_at
                    FROM item, user, favorites_relation, collection
                    WHERE item.collection_name = "${id}"
                    AND item.collection_name = collection.name
                    AND item.owner = user.address
                    AND item.token_id = favorites_relation.token_id
                    ORDER BY item.created_at DESC
                    LIMIT ${start}, ${_limit}
                    `);
            }
            if (tab === "auction") {
                information = await this.auctionRepository.query(`
                SELECT DISTINCT item.token_id, item.name, item.address, item.image, user.name AS user_name, favorites_relation.count, auction.id AS auction_id, auction.ended_at, auction.started_at
                FROM auction, item, user, favorites_relation, collection
                WHERE item.collection_name = "${id}"
                AND item.owner = user.address
                AND item.token_id = favorites_relation.token_id
                AND auction.token_id = item.token_id
                AND auction.progress = true
                ORDER BY auction.started_at DESC
                LIMIT ${start}, ${_limit}
                `);
                information.forEach((element) => {
                    const ended_at = date_calculate(element.ended_at);
                    element.ended_at = ended_at;
                });
            }
            // const items = await this.itemRepository.find({ where: { collection_name: id } });

            console.log("collection", collectionInfo, "information", information);
            // return { collectionInfo, items };
            return Object.assign({
                statusCode: 200,
                success: true,
                statusMsg: "컬렉션을 불러왔습니다.",
                data: collectionInfo,
                information,
            });
        } catch (error) {
            console.log(error.message);
            throw new BadRequestException(error.message);
        }
    }

    // 컬렉션 생성
    async newCollection(collectionData, files: Express.Multer.File[], address: string) {
        try {
            // console.log("서비스 컬렉션 데이터", collectionData);
            // console.log("files", files);
            // console.log("서비스 address", address);

            const json = collectionData.fileInfo;
            // console.log(1);
            // console.log(json, "json");

            const obj = JSON.parse(json);
            // console.log(obj, "obj");

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
    async updateCollection(id: string, updateData, address: string, files: Express.Multer.File[]) {
        try {
            const exisCollection = await this.findByOneCollection(id);
            console.log(exisCollection);
            if (exisCollection.address !== address) {
                throw new NotFoundException(`본인만 수정 가능합니다.`);
            }

            const json = updateData.fileInfo;
            // console.log(1);
            // console.log(json, "json");

            const obj = JSON.parse(json);
            // console.log("obj", obj);
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
            await this.collectionRepository.update(id, exisCollection);

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
    async deleteCollection(id: string, address: string) {
        try {
            console.log("서비스 아이디 확인", address);
            console.log("컬럼삭제 서비스 아이디 확인", id);
            const exisCollection = await this.findByOneCollection(id);
            console.log("서비스, 컬럼확인", exisCollection);
            if (exisCollection.address !== address) {
                throw new NotFoundException(`본인만 삭제 가능합니다.`);
            }
            // await this.collectionRepository.query(`UPDATE collection SET archived = 1 WHERE name = "${id}";`);
            // await this.collectionRepository.delete(exisCollection);
            await this.collectionRepository.query(`
            UPDATE collection SET archived_at = NOW(), archived = 1 WHERE name = "${id}"
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
