import { PartialType } from "@nestjs/mapped-types";
import { CreateItemDto } from "./createItem.dto";

export class UpdateItemDto extends PartialType(CreateItemDto) {}
