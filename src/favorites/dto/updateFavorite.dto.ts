import { PartialType } from "@nestjs/mapped-types";
import { CreateFavoriteDto } from "./createFavorite.dto";

export class UpdateFavoriteDto extends PartialType(CreateFavoriteDto) {}
