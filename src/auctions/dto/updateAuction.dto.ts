import { PartialType } from "@nestjs/mapped-types";
import { CreateAuctionDto } from "./createAuction.dto";

export class UpdateAuctionDto extends PartialType(CreateAuctionDto) {}
