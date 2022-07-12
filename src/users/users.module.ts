import { Module } from "@nestjs/common";
import { UsersService } from "./users.service";
import { UsersController } from "./users.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "./entities/user.entity";
import { Collection } from "src/collections/entities/collection.entity";

@Module({
    imports: [TypeOrmModule.forFeature([User, Collection])],
    exports: [TypeOrmModule],
    controllers: [UsersController],
    providers: [UsersService],
})
export class UsersModule {}
