import { Module } from "@nestjs/common";
import { UsersService } from "./users.service";
import { UsersController } from "./users.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Users } from "./entities/user.entity";
import { Collection } from "src/collections/entities/collection.entity";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { jwtStragtegy } from "./jwt.stratege";

@Module({
    imports: [
        PassportModule.register({ defaultStrategy: "jwt" }),
        JwtModule.register({
            secret: "test",
        }),
        TypeOrmModule.forFeature([Users, Collection]),
    ],
    exports: [TypeOrmModule, jwtStragtegy, PassportModule],
    controllers: [UsersController],
    providers: [UsersService, jwtStragtegy],
})
export class UsersModule {}
