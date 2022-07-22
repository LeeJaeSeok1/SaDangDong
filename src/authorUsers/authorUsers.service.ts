import { Injectable } from "@nestjs/common";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { Collection } from "src/collections/entities/collection.entity";
import { Item } from "src/items/entities/item.entity";
import { Auction } from "src/auctions/entities/auction.entity";
import { User } from "src/users/entities/user.entity";

@Injectable()
export class AuthorUsersService {
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

    async authorInfo(tab: string, address: string) {
        try {
            console.log(tab, address);
            const userInfo = await this.userRepository.query(`
            SELECT name, profile_image, banner_image
            FROM user
            WHERE user.address = "${address}"
            `);
            let information;
            console.log(userInfo);
            if (tab === "collection") {
                information = await this.collectionRepository.query(`
                SELECT *
                FROM (
                    SELECT collection.description, collection.name, collection.feature_image, collection.address, user.name AS user_name, user.profile_image
                    FROM collection, user
                    WHERE collection.address = user.address)
                as g
                WHERE g.address = "${address}";
                `);
            }
            if (tab === "item") {
                information = await this.itemRepository.query(`
                SELECT *
                FROM  (
                SELECT item.*, user.name AS user_name
                FROM item, user
                WHERE item.owner = user.address
                ) as g 
                WHERE g.owner = "${address}"
                `);
            }
            console.log(information);
            // if (tab === "auction") {
            // }

            return Object.assign({
                statusCode: 200,
                success: true,
                statusMsg: "유저의 정보를 불러왓습니다.",
                data: information,
                userInfo,
            });
        } catch (error) {
            console.log(error.message);
        }
    }
}
