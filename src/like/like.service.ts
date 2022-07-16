import { Injectable } from "@nestjs/common";
import { CreateLikeDto } from "./dto/createLike.dto";
import { UpdateLikeDto } from "./dto/updateLike.dto";

@Injectable()
export class LikeService {
    create(createLikeDto: CreateLikeDto) {
        return "This action adds a new favorite";
    }

    findAll() {
        return `This action returns all favorites`;
    }

    findOne(id: number) {
        return `This action returns a #${id} favorite`;
    }

    update(id: number, updateLikeDto: UpdateLikeDto) {
        return `This action updates a #${id} favorite`;
    }

    remove(id: number) {
        return `This action removes a #${id} favorite`;
    }
}
