import { IsString } from "class-validator";

export class Query {
    @IsString()
    collection: string;

    @IsString()
    item: string;

    @IsString()
    like: string;
}
