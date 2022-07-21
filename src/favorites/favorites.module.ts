import { Module } from "@nestjs/common";
import { FavoritesService } from "./favorites.service";
import { FavoritesController } from "./favorites.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Favolites } from "./entities/favorites.entity";
import { FavolitesCount } from "./entities/favoritesCount.entity";

@Module({
    imports: [TypeOrmModule.forFeature([Favolites, FavolitesCount])],
    exports: [TypeOrmModule],
    controllers: [FavoritesController],
    providers: [FavoritesService],
})
export class FavoritesModule {}
