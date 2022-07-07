import { Injectable } from "@nestjs/common";
import { CreateFavoriteDto } from "./dto/createFavorite.dto";
import { UpdateFavoriteDto } from "./dto/updateFavorite.dto";

@Injectable()
export class FavoritesService {
    create(createFavoriteDto: CreateFavoriteDto) {
        return "This action adds a new favorite";
    }

    findAll() {
        return `This action returns all favorites`;
    }

    findOne(id: number) {
        return `This action returns a #${id} favorite`;
    }

    update(id: number, updateFavoriteDto: UpdateFavoriteDto) {
        return `This action updates a #${id} favorite`;
    }

    remove(id: number) {
        return `This action removes a #${id} favorite`;
    }
}
