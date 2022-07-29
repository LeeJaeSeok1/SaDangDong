import { Module, ValidationPipe } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConfigModule } from "@nestjs/config";
import { typeORMConfig } from "./config/typeorm.config";
import config from "./config/config";
import { APP_PIPE } from "@nestjs/core";
import * as Joi from "joi";
import { CollectionsModule } from "./collections/collections.module";
// import { EventsModule } from "./events/events.module";
import { ImagesModule } from "./images/images.module";
import { AuctionsModule } from "./auctions/auctions.module";
import { SearchModule } from "./search/search.module";
import { ExploreModule } from "./explore/explore.module";
import { UsersModule } from "./users/users.module";
import { ItemsModule } from "./items/items.module";
import { SellModule } from "./sell/sell.module";
// import { ChatModule } from "./chat/chat.module";
import { FavoritesModule } from "./favorites/favorites.module";
import { OfferModule } from "./offer/offer.module";
import { HelloModule } from "./hello/hello.module";
import { TaskModule } from "./task/task.module";

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
        TypeOrmModule.forRoot(typeORMConfig),
        // ChatModule,
        UsersModule,
        CollectionsModule,
        ItemsModule,
        AuctionsModule,
        SearchModule,
        ExploreModule,
        SellModule,
        FavoritesModule,
        // EventsModule,
        ImagesModule,
        OfferModule,
        HelloModule,
        TaskModule,
    ],
    controllers: [AppController],
    providers: [AppService, { provide: APP_PIPE, useClass: ValidationPipe }],
})
export class AppModule {}
