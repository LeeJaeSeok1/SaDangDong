import { BadRequestException, Injectable } from "@nestjs/common";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { Collection } from "src/collections/entities/collection.entity";
import { Item } from "src/items/entities/item.entity";
import { Auction } from "src/auctions/entities/auction.entity";
import { User } from "src/users/entities/user.entity";

@Injectable()
export class SearchService {
    constructor(
        @InjectRepository(Collection)
        private collectionRepository: Repository<Collection>,
        @InjectRepository(Item)
        private itemRepository: Repository<Item>,
        @InjectRepository(Auction)
        private auctionRepository: Repository<Auction>,
        @InjectRepository(User)
        private userRepository: Repository<User>,
    ) {}

    async searchInfo(tab: string, name: string, page: number, pageSize: number) {
        try {
            console.log(name, tab);

            let start = 0;
            if (page <= 0) {
                page = 1;
            }
            start = (page - 1) * pageSize;

            let information;
            if (tab === "collection") {
                const pageCount = await this.collectionRepository.count();
                if (page > Math.round(pageCount / pageSize)) {
                    return null;
                }
                information = await this.collectionRepository.query(`
                SELECT collection.description, collection.name, collection.feature_image, user.name AS user_name, user.profile_image
                FROM collection, user
                WHERE collection.name like "%${name}%" 
                AND collection.address = user.address
                ORDER BY collection.created_at DESC
                LIMIT ${start}, ${pageSize}
                `);
            }

            if (tab === "item") {
                const pageCount = await this.itemRepository.count();
                if (page > Math.round(pageCount / pageSize)) {
                    return null;
                }
                information = await this.itemRepository.query(`
                SELECT item.name, item.address, item.image, user.name AS user_name, favorites_relation.count
                FROM item, user, favorites_relation
                WHERE item.name like '%${name}%' 
                AND item.address = user.address
                AND item.token_id = favorites_relation.token_id
                ORDER BY item.created_at DESC
                LIMIT ${start}, ${pageSize}
                `);
            }

            if (tab === "auction") {
                const pageCount = await this.auctionRepository.count();
                if (page > Math.round(pageCount / pageSize)) {
                    return null;
                }
                information = await this.auctionRepository.query(`
                SELECT item.token_id, item.name, item.address, item.image, user.name AS user_name, favorites_relation.count, auction.id AS auction_id, auction.ended_at
                FROM auction, item, user, favorites_relation
                WHERE item.name like '%${name}%'
                AND item.address = user.address
                AND item.token_id = favorites_relation.token_id
                AND auction.token_id = item.token_id
                AND auction.progress = true
                ORDER BY auction.started_at DESC
                LIMIT ${start}, ${pageSize}
                `);
            }
            console.log(information);
            return Object.assign({
                statusCode: 200,
                success: true,
                statusMsg: `${tab}의 검색 목록을 불러왔습니다.`,
                data: information,
            });
        } catch (error) {
            throw new BadRequestException(error.message);
        }
    }
}
