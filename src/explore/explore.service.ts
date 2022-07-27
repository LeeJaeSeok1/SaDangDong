import { Injectable } from "@nestjs/common";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { Collection } from "src/collections/entities/collection.entity";
import { Item } from "src/items/entities/item.entity";
import { Auction } from "src/auctions/entities/auction.entity";
import { User } from "src/users/entities/user.entity";
import { Favorites_Relation } from "src/favorites/entities/favorites_relation.entity";
import { Favorites } from "src/favorites/entities/favorites.entity";
import { Offset } from "src/plug/pagination.function";
import { date_calculate, create_date, now_date } from "src/plug/caculation.function";
import { Sell } from "src/sell/entities/sell.entity";

@Injectable()
export class ExploreService {
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
        @InjectRepository(Sell)
        private sellRepository: Repository<Sell>,
    ) {}

    async mainInfo(_page) {
        try {
            const start = Offset(_page, 4);
            const auction = await this.auctionRepository.query(`
            SELECT auction.id, auction.ended_at, item.image, item.token_id, item.name, item.address, user.name, favorites_relation.count, bidding.price
            FROM auction, item, favorites_relation, bidding
            WHERE auction.progress = true
            AND auction.token_id = item.token_id
            AND item.address = user.address
            AND item.token_id = favorites_relation.token_id
            AND auction.id = bidding.auctionId
            ORDER BY auction.ended_at DESC
            LIMIT ${start}, 4
            `);
            auction.forEach((element) => {
                const remained_at = date_calculate(element.ended_at);
                element.remained_at = remained_at;
            });

            const nowdate = now_date();

            const ranking = await this.sellRepository.query(`
            SELECt user.name, sell.count
            FROM sell, user
            WHERE sell.address = user.address
            AND sell.start_at < ${nowdate}
            AND sell.end_at > ${nowdate}
            ORDER BY sell.count DESC
            LIMIT 5
            `);

            return { auction, ranking };
        } catch (error) {
            console.log(error.message);
        }
    }

    async exploreInfo(tab: string, address: string, _page: number, _limit: number) {
        try {
            // 페이지 네이션 처리
            const start = Offset(_page, _limit);
            let information;

            if (tab === "collection") {
                information = await this.collectionRepository.query(`
                SELECT DISTINCT collection.name, collection.description, collection.feature_image, collection.created_at,
                user.name AS user_name, user.profile_image
                FROM collection, user
                WHERE collection.address = user.address
                ORDER BY collection.created_at DESC
                LIMIT ${start}, ${_limit}
                `);
                // 오더바이 아래에 추가
                console.log("스타트", start, "리밋", _limit);
                console.log(information);
                console.log(typeof information);
            }

            if (tab === "item") {
                information = await this.itemRepository.query(`
                SELECT DISTINCT item.token_id, item.name, item.address, item.image, item.created_at, user.name AS user_name, favorites_relation.count
                FROM item, user, favorites_relation
                WHERE item.address = user.address
                AND item.token_id = favorites_relation.token_id
                ORDER BY item.created_at DESC
                LIMIT ${start}, ${_limit}
                `);
            }

            if (tab === "auction") {
                information = await this.auctionRepository.query(`
                SELECT DISTINCT item.token_id, item.name, item.address, item.image, auction.started_at, user.name AS user_name, favorites_relation.count, auction.id AS auction_id, auction.ended_at
                FROM auction, item, user, favorites_relation
                WHERE item.address = user.address
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

            console.log(information);

            return Object.assign({
                statusCode: 200,
                success: true,
                statusMsg: `${tab} 정보를 불러왔습니다.`,
                data: information,
            });
        } catch (error) {
            console.log(error.message);
        }
    }
}
