import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Favolites } from "./entities/favorites.entity";
import { FavolitesCount } from "./entities/favoritesCount.entity";

@Injectable()
export class FavoritesService {
    constructor(
        @InjectRepository(Favolites)
        private favoritesRepository: Repository<Favolites>,
        @InjectRepository(FavolitesCount)
        private favoritesCountRepository: Repository<FavolitesCount>,
    ) {}

    async favorites(id: string, addressId: string) {
        try {
            const findUser = await this.favoritesRepository.findOne({ where: { item_id: id, address: addressId } });
            const findCount = await this.favoritesCountRepository.findOne({ where: { item_id: id } });

            if (!findCount) throw new NotFoundException("아이템이 없습니다.");

            if (!findUser) {
                const favorites = new Favolites();
                favorites.address = addressId;
                favorites.item_id = id;
                favorites.isFavorites = true;
                await this.favoritesRepository.save(favorites);

                const count = await this.favoritesCountRepository.query(
                    `UPDATE favolites_count SET favoritesCount = favoritesCount+1 WHERE item_id = "${id}";`,
                );
                return Object.assign({
                    statusCods: 201,
                    success: true,
                    statusMsg: "favortes에 추가 했습니다",
                    data: favorites,
                    count,
                });
            }

            if (findUser.isFavorites === false) {
                const updateFavotites = await this.favoritesRepository.query(
                    `UPDATE favolites SET isFavorites = true WHERE address = "${addressId}" AND item_id = "${id}";`,
                );

                const favoritesCount = await this.favoritesCountRepository.query(
                    `UPDATE favolites_count SET favoritesCount = favoritesCount+1 WHERE item_id = "${id}";`,
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
                `UPDATE favolites SET isFavorites = false WHERE address = "${addressId}" AND item_id = "${id}";`,
            );
            const disfavoritesCount = await this.favoritesCountRepository.query(
                `UPDATE favolites_count SET favoritesCount = favoritesCount-1 WHERE item_id = "${id}";`,
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

    // async likeItem(id: string, addressId: string) {
    //     try {
    //         const findUser = await this.favoritesRepository.findOne({ where: { item_id: id, address: addressId } });
    //         const findCount = await this.favoritesCountRepository.findOne({ where: { item_id: id } });

    //         if (!findCount) throw new NotFoundException("아이템이 없습니다.");

    //         if (!findUser) {
    //             const favorites = new Favolites();
    //             favorites.address = addressId;
    //             favorites.item_id = id;
    //             favorites.isFavorites = true;
    //             await this.favoritesRepository.save(favorites);

    //             const count = await this.favoritesCountRepository.query(
    //                 `UPDATE favolites_count SET favoritesCount = favoritesCount+1 WHERE item_id = "${id}";`,
    //             );
    //             return Object.assign({
    //                 statusCods: 201,
    //                 success: true,
    //                 statusMsg: "favortes에 추가 했습니다",
    //                 data: favorites,
    //                 count,
    //             });
    //         }
    //         if (findUser && findUser.isFavorites === false) {
    //             const updateFavotites = await this.favoritesRepository.query(
    //                 `UPDATE favolites SET isFavorites = true WHERE address = "${addressId}" AND item_id = "${id}";`,
    //             );

    //             const favoritesCount = await this.favoritesCountRepository.query(
    //                 `UPDATE favolites_count SET favoritesCount = favoritesCount+1 WHERE item_id = "${id}";`,
    //             );
    //             return Object.assign({
    //                 statusCode: 201,
    //                 success: true,
    //                 statusMsg: "좋아요에 추가 했습니다.",
    //                 data: updateFavotites,
    //                 favoritesCount,
    //             });
    //         }
    //         throw new BadRequestException("이미 누르셨습니다.");
    //     } catch (error) {
    //         throw new BadRequestException(error.message);
    //     }
    // }

    // async disLikeItem(id: string, addressId: string) {
    //     try {
    //         const findUser = await this.favoritesRepository.findOne({ where: { item_id: id, address: addressId } });
    //         const findCount = await this.favoritesCountRepository.findOne({ where: { item_id: id } });
    //         console.log("findUser", findUser, "findCount", findCount);

    //         if (!findCount) throw new NotFoundException("아이템이 없습니다.");
    //         if (!findUser) {
    //             const favorites = new Favolites();
    //             favorites.address = addressId;
    //             favorites.item_id = id;
    //             await this.favoritesRepository.save(favorites);

    //             return Object.assign({
    //                 statusCods: 201,
    //                 success: true,
    //                 statusMsg: "유저를 추가 했습니다",
    //                 data: favorites,
    //             });
    //         }

    //         if (findUser.isFavorites === false) {
    //             throw new NotFoundException("좋아요를 누르지 않았습니다.");
    //         }

    //         const dislike = await this.favoritesRepository.query(
    //             `UPDATE favolites SET isFavorites = false WHERE address = "${addressId}" AND item_id = "${id}";`,
    //         );

    //         const dislikeCount = await this.favoritesCountRepository.query(
    //             `UPDATE favolites_count SET favoritesCount = favoritesCount-1 WHERE item_id = "${id}";`,
    //         );
    //         return Object.assign({
    //             statusCode: 201,
    //             success: true,
    //             statusMsg: "좋아요를 취소 했습니다.",
    //             data: dislike,
    //             dislikeCount,
    //         });
    //     } catch (error) {
    //         console.log(error.message);
    //         throw new BadRequestException(error.message);
    //     }
    // }
}
