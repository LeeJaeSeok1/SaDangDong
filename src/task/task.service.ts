import { Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Auction } from "src/auctions/entities/auction.entity";
import { Collection } from "src/collections/entities/collection.entity";
import { Favorites } from "src/favorites/entities/favorites.entity";
import { Favorites_Relation } from "src/favorites/entities/favorites_relation.entity";
import { Item } from "src/items/entities/item.entity";
import { Bidding } from "src/offer/entities/bidding.entity";
import { Sell_Relation } from "src/sell/entities/sell_relation.entity";
import { User } from "src/users/entities/user.entity";
import { Repository } from "typeorm";

@Injectable()
export class TaskService {
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
        @InjectRepository(Sell_Relation)
        private sellrelationRepository: Repository<Sell_Relation>,
        @InjectRepository(Bidding)
        private biddingRepository: Repository<Bidding>,
    ) {}
    private readonly logger = new Logger("scheduling");

    async updateAuction() {
        try {
            const auctions = await this.auctionRepository.query(`
            SELECT *
            FROM auction
            WHERE ended_at < ADDTIME(now(),'9:0:0.000000')
            AND progress = true
            `);
            await Promise.all(
                auctions.map((element) => {
                    element.progress = false;
                    this.auctionRepository.update(element.id, element);
                }),
            );

            this.logger.log(auctions);
        } catch (error) {
            this.logger.log(error.message);
        }
    }
}
