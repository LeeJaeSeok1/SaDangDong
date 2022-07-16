import { PartialType } from "@nestjs/mapped-types";
import { CreateLikeDto } from "./createLike.dto";

export class UpdateLikeDto extends PartialType(CreateLikeDto) {}
