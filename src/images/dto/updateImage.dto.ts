import { PartialType } from "@nestjs/mapped-types";
import { CreateImageDto } from "./createImage.dto";

export class UpdateImageDto extends PartialType(CreateImageDto) {}
