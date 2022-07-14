import { Module } from "@nestjs/common";
import { ItemsService } from "./items.service";
import { ItemsController } from "./items.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Item } from "./entities/item.entity";
import { PassportModule } from "@nestjs/passport";
import { Collection } from "src/collections/entities/collection.entity";

@Module({
    imports: [TypeOrmModule.forFeature([Item, Collection]), PassportModule.register({ defaultStrategy: "jwt" })],
    exports: [TypeOrmModule],
    controllers: [ItemsController],
    providers: [ItemsService],
})
export class ItemsModule {}
