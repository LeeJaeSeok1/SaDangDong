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

@Module({
  imports: [UsersModule, CollectionsModule, ItemsModule, AuctionsModule, SearchModule, ExploreModule, SellModule, FavoritesModule, EventsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
