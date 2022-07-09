import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { UsersModule } from "./users/users.module";
import { CollectionsModule } from "./collections/collections.module";
import { ItemsModule } from "./items/items.module";
import { AuctionsModule } from "./auctions/auctions.module";
import { SearchModule } from "./search/search.module";
import { ExploreModule } from "./explore/explore.module";
import { SellModule } from "./sell/sell.module";
import { FavoritesModule } from "./favorites/favorites.module";
import { EventsModule } from "./events/events.module";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ChatModule } from "./chat/chat.module";
import * as Joi from "joi";
import { ConfigModule } from "@nestjs/config";
import { typeORMConfig } from "./config/typeorm.config";
import config from "./config/config";
// import { ImagesModule } from "./images/images.module";

@Module({
    imports: [
        ConfigModule.forRoot({
            load: [config],
            isGlobal: true,
            validationSchema: Joi.object({
                NODE_PORT: Joi.string().required(),
                REDIS_PORT: Joi.string().required(),
                REDIS_HOST: Joi.string().required(),
            }),
        }),
        ChatModule,
        UsersModule,
        CollectionsModule,
        ItemsModule,
        AuctionsModule,
        SearchModule,
        ExploreModule,
        SellModule,
        FavoritesModule,
        EventsModule,
        TypeOrmModule.forRoot(typeORMConfig),
        // ImagesModule,
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
