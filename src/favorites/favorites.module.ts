import { Module } from "@nestjs/common";
import { LikeService } from "./favorites.service";
import { LikeController } from "./favorites.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Favolites } from "./entities/favorites.entity";
import { FavolitesCount } from "./entities/favoritesCount.entity";

@Module({
    imports: [TypeOrmModule.forFeature([Favolites, FavolitesCount])],
    exports: [TypeOrmModule],
    controllers: [LikeController],
    providers: [LikeService],
})
export class FavoritesModule {}
