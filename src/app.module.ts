import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { CollectionsModule } from './collections/collections.module';
import { ItemsModule } from './items/items.module';
import { AuctionsModule } from './auctions/auctions.module';
import { SearchModule } from './search/search.module';
import { ExploreModule } from './explore/explore.module';
import { SellModule } from './sell/sell.module';
import { FavoritesModule } from './favorites/favorites.module';
import { EventsModule } from './events/events.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './users/entities/user.entity';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule.forRoot({
              isGlobal: true
            }),UsersModule, CollectionsModule, ItemsModule, AuctionsModule, SearchModule,
              ExploreModule, SellModule, FavoritesModule, EventsModule, TypeOrmModule.forRoot({
              type: 'mysql',
              host: 'localhost',
              username: process.env.DB_NAME,
              password: process.env.DB_PASSWORD,
              database: 'test',
              entities: [User],
              synchronize:true,
            }),
            UsersModule
          ],

  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
