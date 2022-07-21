import { Module } from "@nestjs/common";
import { LikeService } from "./like.service";
import { LikeController } from "./like.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Like } from "./entities/like.entity";
import { LikeCount } from "./entities/likeCount.entity";

@Module({
    imports: [TypeOrmModule.forFeature([Like, LikeCount])],
    exports: [TypeOrmModule],
    controllers: [LikeController],
    providers: [LikeService],
})
export class LikeModule {}
