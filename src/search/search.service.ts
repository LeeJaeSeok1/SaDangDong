import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { Collection } from "src/collections/entities/collection.entity";
import { Item } from "src/items/entities/item.entity";
import { Auction } from "src/auctions/entities/auction.entity";

@Injectable()
export class SearchService {
    constructor(
        @InjectRepository(Collection)
        private collectionRepository: Repository<Collection>,
        @InjectRepository(Item)
        private itemRepository: Repository<Item>,
        @InjectRepository(Auction)
        private auctionRepository: Repository<Item>,
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
                SELECT item.name, item.address
                FROM item
                WHERE item.name like '${name}'
                `);
            }

            // if (tab === "auction") {
            //     const auctions = [];
            // }
            return information;
        } catch (error) {
            throw new BadRequestException(error.message);
        }
    }
}
