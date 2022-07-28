import { BadRequestException, Injectable } from "@nestjs/common";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { Collection } from "src/collections/entities/collection.entity";
import { Item } from "src/items/entities/item.entity";
import { Auction } from "src/auctions/entities/auction.entity";
import { User } from "src/users/entities/user.entity";
import { Favorites_Relation } from "src/favorites/entities/favorites_relation.entity";
import { Favorites } from "src/favorites/entities/favorites.entity";
import { Offset } from "src/plug/pagination.function";
import { date_calculate, create_date, now_date, parse_calculate, mysqlnow_date } from "src/plug/caculation.function";
import { Sell } from "src/sell/entities/sell.entity";
import { Bidding } from "src/offer/entities/bidding.entity";

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
        @InjectRepository(Bidding)
        private biddingRepository: Repository<Bidding>,
    ) {}

    async mainInfo(_page, address) {
        try {
            console.log("시작");
            if (!_page) {
                _page = 0;
            }
            console.log(1);
            const start = Offset(_page, 4);
            console.log(3, start);
            const auction_item = await this.itemRepository.query(`
            SELECT item.token_id, item.image, item.name, auction.id AS auction_id,
            auction.ended_at, user.name AS user_name, favorites_relation.count
            FROM item
                LEFT JOIN auction
                ON item.token_id = auction.token_id
                LEFT JOIN user
                ON  item.address = user.address
                LEFT JOIN favorites_relation
                ON  item.token_id = favorites_relation.token_id
            LIMIT ${start}, 4
            `);
            console.log(2);
            auction_item.forEach(async (element) => {
                const remained_at = date_calculate(element.ended_at);
                element.remained_at = remained_at;
                const ended_at = parse_calculate(element.ended_at);
                element.ended_at = ended_at;

                if (!address) {
                    const [result_bidding] = await this.biddingRepository.query(`
                        SELECT price
                        FROM bidding
                        WHERE auctionId = "${element.auction_id}"
                        `);
                    element.isFavorites = false;
                    element.price = result_bidding.price;
                } else {
                    const [result_favorties, result_bidding] = await Promise.all([
                        this.favoritesRepository.query(`
                        SELECT isFavorites
                        FROM favorites             
                        WHERE favorites.token_id = "${element.token_id}"
                        AND favorites.address = "${address}"
                        `),
                        this.biddingRepository.query(`
                        SELECT price
                        FROM bidding
                        WHERE auctionId = "${element.auction_id}"
                        `),
                    ]);

                    element.isFavorites = result_favorties.isFavorites;
                    element.price = result_bidding.price;
                }
            });

            console.log(4);

            const nowdate = mysqlnow_date();
            console.log(auction_item);
            const ranking = await this.sellRepository.query(`
            SELECT user.name, sell.count
            FROM sell, user
            WHERE sell.address = user.address
            AND sell.start_at <= ${nowdate}
            AND sell.end_at > ${nowdate}
            ORDER BY sell.count DESC
            LIMIT 5
            `);
            console.log(ranking);
            // 2022-07-28 17:56:32.480812

            return Object.assign({
                statusCode: 200,
                success: true,
                statusMsg: `메인 정보를 불러왔습니다.`,
                data: { auction_item, ranking },
            });
        } catch (error) {
            throw new BadRequestException(error.message);
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
                user.name AS user_name, user.profile_image, user.address
                FROM collection, user
                WHERE collection.address = user.address
                AND collection.archived = 0
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
                SELECT DISTINCT item.token_id, item.name, item.owner, item.image, item.created_at,
                user.name AS user_name, user.address, favorites_relation.count
                FROM item, user, favorites_relation
                WHERE item.address = user.address
                AND item.token_id = favorites_relation.token_id
                AND item.archived = 0
                ORDER BY item.created_at DESC
                LIMIT ${start}, ${_limit}
                `);
            }

            if (tab === "auction") {
                information = await this.auctionRepository.query(`
                SELECT DISTINCT item.token_id, item.name, item.owner, item.image, auction.started_at, 
                user.name AS user_name, user.address, favorites_relation.count,
                auction.id AS auction_id, auction.ended_at
                FROM auction, item, user, favorites_relation
                WHERE item.address = user.address
                AND item.token_id = favorites_relation.token_id
                AND auction.token_id = item.token_id
                AND auction.progress = true
                ORDER BY auction.started_at DESC
                LIMIT ${start}, ${_limit}
                `);

                information.forEach((element) => {
                    const remained_at = date_calculate(element.ended_at);
                    const parse_end_at = parse_calculate(element.ended_at);
                    element.remained_at = remained_at;
                    element.ended_at = parse_end_at;
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
            throw new BadRequestException(error.message);
        }
    }
}
