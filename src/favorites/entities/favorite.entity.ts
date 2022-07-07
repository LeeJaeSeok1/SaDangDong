import { Item } from "src/items/entities/item.entity";
import { Column, Entity } from "typeorm";

@Entity()
export class Favorite extends Item {
    @Column()
    isLike: boolean;
}

@Entity()
export class FavoriteCount extends Item {
    @Column()
    likeCount: number;
}
