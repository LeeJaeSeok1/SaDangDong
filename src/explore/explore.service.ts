import { Injectable } from "@nestjs/common";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { Collection } from "src/collections/entities/collection.entity";
import { Item } from "src/items/entities/item.entity";
import { Auction } from "src/auctions/entities/auction.entity";
import { User } from "src/users/entities/user.entity";
import { Favorites_Relation } from "src/favorites/entities/favorites_relation.entity";
import { Favorites } from "src/favorites/entities/favorites.entity";

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
    ) {}

    async mainInfo() {
        try {
        } catch (error) {
            console.log(error.message);
        }
    }

    async exploreInfo(tab: string, address: string) {
        try {
            console.log(tab, address);
            let information;
            if (tab === "collection") {
                information = await this.collectionRepository.query(`
                SELECT collection.description, collection.name, collection.feature_image, user.name AS user_name, user.profile_image
                FROM collection, user
                WHERE collection.address = user.address
                `);
            }

            if (tab === "item") {
                information = await this.itemRepository.query(`
                SELECT item.token_id, item.name, item.address, item.image, user.name AS user_name, favorites_relation.count
                FROM item, user, favorites_relation
                WHERE item.address = user.address
                AND item.token_id = favorites_relation.token_id
                `);
            }

            if (tab === "auction") {
                information = await this.itemRepository.query(`
                SELECT item.token_id, item.name, item.address, item.image, user.name AS user_name, favorites_relation.count, auction.id AS auction_id, auction.ended_at
                FROM auction, item, user, favorites_relation
                WHERE item.address = user.address
                AND item.token_id = favorites_relation.token_id
                AND auction.token_id = item.token_id
                AND auction.progress = true
                `);
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
