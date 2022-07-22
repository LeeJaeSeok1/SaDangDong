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

    async searchInfo(tab: string, name: string) {
        try {
            console.log(name, tab);
            let information;
            if (tab === "collection") {
                information = await this.collectionRepository.query(`
                SELECT collection.description, collection.name, collection.feature_image, user.name AS user_name, user.profile_image
                FROM collection, user
                WHERE collection.name like '%${name}%' AND collection.address = user.address
                `);
            }
            console.log(information);

            if (tab === "item") {
                information = await this.itemRepository.query(`
                SELECT item.name, item.address, item.image, user.name AS user_name
                FROM item, user
                WHERE item.name like '%${name}%' AND item.address = user.address
                `);
            }

            // if (tab === "auction") {
            //     const auctions = [];
            // }
            return Object.assign({
                statusCode: 200,
                success: true,
                statusMsg: "검색 목록을 불러왔습니다.",
                data: information,
            });
        } catch (error) {
            throw new BadRequestException(error.message);
        }
    }
}
