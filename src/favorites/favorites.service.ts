import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Favorites } from "./entities/favorites.entity";
import { Favorites_Relation } from "./entities/favorites_relation.entity";

@Injectable()
export class FavoritesService {
    constructor(
        @InjectRepository(Favorites)
        private favoritesRepository: Repository<Favorites>,
        @InjectRepository(Favorites_Relation)
        private favoritesRelationRepository: Repository<Favorites_Relation>,
    ) {}

    async favorites(id: string, addressId: string) {
        try {
            const findUser = await this.favoritesRepository.findOne({ where: { token_id: id, address: addressId } });
            const findCount = await this.favoritesRelationRepository.findOne({ where: { token_id: id } });

            if (!findCount) throw new NotFoundException("아이템이 없습니다.");

            if (!findUser) {
                const favorites = new Favorites();
                favorites.address = addressId;
                favorites.token_id = id;
                favorites.isFavorites = true;
                await this.favoritesRepository.save(favorites);

                const count = await this.favoritesRelationRepository.query(
                    `UPDATE favorites_relation SET count = count+1 WHERE item_id = "${id}";`,
                );
                return Object.assign({
                    success: true,
                    statusMsg: "favorites에 추가 했습니다",
                    data: favorites,
                    count,
                });
            }

            if (findUser.isFavorites === false) {
                const updateFavotites = await this.favoritesRepository.query(
                    `UPDATE favorites SET isFavorites = true WHERE address = "${addressId}" AND token_id = "${id}";`,
                );

                const favoritesCount = await this.favoritesRelationRepository.query(
                    `UPDATE favorites_relation SET count = count+1 WHERE item_id = "${id}";`,
                );
                return Object.assign({
                    statusCode: 201,
                    success: true,
                    statusMsg: "favortes에 추가 했습니다.",
                    data: updateFavotites,
                    favoritesCount,
                });
            }

            const disfavorites = await this.favoritesRepository.query(
                `UPDATE favorites SET isFavorites = false WHERE address = "${addressId}" AND token_id = "${id}";`,
            );
            const disfavoritesCount = await this.favoritesRelationRepository.query(
                `UPDATE favorites_relation SET count = count-1 WHERE item_id = "${id}";`,
            );
            return Object.assign({
                statusCode: 201,
                success: true,
                statusMsg: "좋아요를 취소 했습니다.",
                data: disfavorites,
                disfavoritesCount,
            });
        } catch (error) {
            throw new BadRequestException(error.message);
        }
    }
}
