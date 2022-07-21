import { Module } from "@nestjs/common";
import { ItemsService } from "./items.service";
import { ItemsController } from "./items.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Item } from "./entities/item.entity";
import { Collection } from "src/collections/entities/collection.entity";
import { User } from "src/users/entities/user.entity";
import { LikeCount } from "src/like/entities/likeCount.entity";

@Module({
    imports: [TypeOrmModule.forFeature([Item, Collection, User, LikeCount])],
    exports: [TypeOrmModule],
    controllers: [ItemsController],
    providers: [ItemsService],
})
export class ItemsModule {}
