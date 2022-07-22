import { Injectable } from "@nestjs/common";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { Collection } from "src/collections/entities/collection.entity";
import { Item } from "src/items/entities/item.entity";
import { Auction } from "src/auctions/entities/auction.entity";
import { User } from "src/users/entities/user.entity";

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
    ) {}

    async mainInfo() {
        try {
        } catch (error) {
            console.log(error.message);
        }
    }

    async exploreInfo(tab: string) {
        try {
            console.log(tab);
            let information;
            if (tab === "collection") {
                information = await this.collectionRepository.query(`
                SELECT collection.description, collection.name, collection.feature_image, user.name AS user_name, user.profile_image
                FROM collection, user
                WHERE collection.address = user.address
                `);
            }
            console.log(information);

            if (tab === "item") {
                information = await this.itemRepository.query(`
                SELECT item.name, item.address, item.image, item.token_id, user.name AS user_name
                FROM item, user
                WHERE item.address = user.address
                `);
            }

            // if (tab === "auction") {
            //     information = ?
            // }

            return Object.assign({
                statusCode: 200,
                success: true,
                statusMsg: "정보를 불러왔습니다.",
                data: information,
            });
        } catch (error) {
            console.log(error.message);
        }
    }
}
