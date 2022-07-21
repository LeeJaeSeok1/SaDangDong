import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Like, LikeCount } from "./entities/like.entity";

@Injectable()
export class LikeService {
    constructor(
        @InjectRepository(Like)
        private likeRepository: Repository<Like>,
        @InjectRepository(LikeCount)
        private likeCountRepository: Repository<LikeCount>,
    ) {}

    async likeItem(id: string, address: string) {
        try {
            const findUser = await this.likeRepository.findOne({ where: { item_id: id, user_id: address } });
            const findCount = await this.likeCountRepository.findOne({ where: { item_id: id } });
            console.log("findUser", findUser, "findCount", findCount);

            if (!findCount) throw new NotFoundException("아이템이 없습니다.");

            if (findUser) {
                if (address !== findUser.user_id) {
                    throw new BadRequestException("사용자를 확인 하시오");
                }

                if (findUser.isLike === false) {
                    const updateLike = await this.likeRepository.findOne({ where: { item_id: id, user_id: address } });
                    updateLike.isLike = true;
                    await this.likeRepository.save(updateLike);
                    const likeCount = await this.likeCountRepository.findOne({ where: { item_id: id } });
                    likeCount.likeCount = findCount.likeCount + 1;
                    await this.likeCountRepository.save(likeCount);
                    return { updateLike, likeCount };
                } else {
                    throw new BadRequestException("이미 누르셨습니다.");
                }
            }

            const userLike = await this.likeRepository.create({ item_id: id, user_id: address, isLike: true });
            const userLikeCount = await this.likeCountRepository.findOne({ where: { item_id: id } });
            userLikeCount.likeCount = findCount.likeCount + 1;
            await this.likeCountRepository.save(userLikeCount);
            return { userLike, userLikeCount };
        } catch (error) {
            throw new BadRequestException(error.message);
        }
    }

    async disLikeItem(id: string, address: string) {
        const findUser = await this.likeRepository.findOne({ where: { item_id: id, user_id: address } });
        const findCount = await this.likeCountRepository.findOne({ where: { item_id: id } });
        console.log("findUser", findUser, "findCount", findCount);

        if (!findCount) throw new NotFoundException("아이템이 없습니다.");

        if (findUser.isLike === false) {
            throw new NotFoundException("좋아요를 누르지 않았습니다.");
        }

        const dislike = await this.likeRepository.findOne({ where: { item_id: id, user_id: address } });
        dislike.isLike = false;
        await this.likeRepository.save(dislike);
        const dislikeCount = await this.likeCountRepository.findOne({ where: { item_id: id } });
        dislikeCount.likeCount = findCount.likeCount - 1;
        await this.likeCountRepository.save(dislikeCount);
        return { dislike, dislikeCount };
    }
}
