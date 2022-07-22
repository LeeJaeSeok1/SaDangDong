import { Module } from "@nestjs/common";
import { FavoritesService } from "./favorites.service";
import { FavoritesController } from "./favorites.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Favorites } from "./entities/favorites.entity";
import { FavoritesCount } from "./entities/favoritesCount.entity";

@Module({
    imports: [TypeOrmModule.forFeature([Favorites, FavoritesCount])],
    exports: [TypeOrmModule],
    controllers: [FavoritesController],
    providers: [FavoritesService],
})
export class FavoritesModule {}
