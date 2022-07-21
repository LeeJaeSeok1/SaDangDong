import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Favolites } from "./entities/favorites.entity";
import { FavolitesCount } from "./entities/favoritesCount.entity";

@Injectable()
export class LikeService {
    constructor(
        @InjectRepository(Favolites)
        private favoritesRepository: Repository<Favolites>,
        @InjectRepository(FavolitesCount)
        private favoritesCountRepository: Repository<FavolitesCount>,
    ) {}

    async likeItem(id: string, address: string) {
        try {
            const findUser = await this.favoritesRepository.findOne({ where: { item_id: id, address: address } });
            console.log(findUser);
            const findCount = await this.favoritesCountRepository.findOne({ where: { item_id: id } });
            console.log("findUser", findUser, "findCount", findCount);

            if (!findCount) throw new NotFoundException("아이템이 없습니다.");
            if (!findUser) {
                const user = new Favolites();
                user.address = address;
                await this.favoritesRepository.save(user);
            }
            if (findUser) {
                if (address !== findUser.address) {
                    throw new BadRequestException("사용자를 확인 하시오");
                }

                if (findUser.isFavorites === false) {
                    await this.favoritesRepository.findOne({ where: { item_id: id, address: address } });
                    const updateLike = new Favolites();
                    updateLike.isFavorites = true;
                    await this.favoritesRepository.save(updateLike);
                    const likeCount = await this.favoritesCountRepository.findOne({ where: { item_id: id } });
                    likeCount.favoritesCount = findCount.favoritesCount + 1;
                    await this.favoritesCountRepository.save(likeCount);
                    // return { updateLike, likeCount };
                    return Object.assign({
                        statusCode: 201,
                        statusMsg: "좋아요에 추가 했습니다.",
                        data: updateLike,
                        likeCount,
                    });
                } else {
                    throw new BadRequestException("이미 누르셨습니다.");
                }
            }

            const userLike = await this.favoritesRepository.create({
                item_id: id,
                address: address,
                isFavorites: true,
            });
            const userLikeCount = await this.favoritesCountRepository.findOne({ where: { item_id: id } });
            userLikeCount.favoritesCount = findCount.favoritesCount + 1;
            await this.favoritesCountRepository.save(userLikeCount);
            return { userLike, userLikeCount };
        } catch (error) {
            throw new BadRequestException(error.message);
        }
    }

    async disLikeItem(id: string, address: string) {
        try {
            const findUser = await this.favoritesRepository.findOne({ where: { item_id: id, address: address } });
            const findCount = await this.favoritesCountRepository.findOne({ where: { item_id: id } });
            console.log("findUser", findUser, "findCount", findCount);

            if (!findCount) throw new NotFoundException("아이템이 없습니다.");

            if (findUser.isFavorites === false) {
                throw new NotFoundException("좋아요를 누르지 않았습니다.");
            }

            const dislike = await this.favoritesRepository.findOne({ where: { item_id: id, address: address } });
            dislike.isFavorites = false;
            await this.favoritesRepository.save(dislike);
            const dislikeCount = await this.favoritesCountRepository.findOne({ where: { item_id: id } });
            dislikeCount.favoritesCount = findCount.favoritesCount - 1;
            await this.favoritesCountRepository.save(dislikeCount);
            return Object.assign({
                statusCode: 201,
                statusMsg: "좋아요에 추가 했습니다.",
                data: dislike,
                dislikeCount,
            });
        } catch (error) {
            console.log(error.message);
            throw new BadRequestException(error.message);
        }
    }
}
