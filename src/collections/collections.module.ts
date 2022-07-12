import { Module } from "@nestjs/common";
import { CollectionsController } from "./collections.controller";
import { CollectionsService } from "./collections.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Collection } from "./entities/collection.entity";
import { User } from "src/users/entities/user.entity";

@Module({
    imports: [TypeOrmModule.forFeature([Collection, User])],
    exports: [TypeOrmModule],
    controllers: [CollectionsController],
    providers: [CollectionsService],
})
export class CollectionsModule {}
