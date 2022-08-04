import { Module } from "@nestjs/common";
import { FavoritesService } from "./favorites.service";
import { FavoritesController } from "./favorites.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Favorites } from "./entities/favorites.entity";
import { Favorites_Relation } from "./entities/favorites_relation.entity";

@Module({
    imports: [TypeOrmModule.forFeature([Favorites, Favorites_Relation])],
    exports: [TypeOrmModule],
    controllers: [FavoritesController],
    providers: [FavoritesService],
})
export class FavoritesModule {}
