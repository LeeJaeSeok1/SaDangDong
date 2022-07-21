import { Module } from "@nestjs/common";
import { LikeService } from "./like.service";
import { LikeController } from "./like.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Like } from "typeorm";
import { LikeCount } from "./entities/like.entity";

@Module({
    imports: [TypeOrmModule.forFeature([Like, LikeCount])],
    exports: [TypeOrmModule],
    controllers: [LikeController],
    providers: [LikeService],
})
export class LikeModule {}
