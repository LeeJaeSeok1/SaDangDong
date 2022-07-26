import {
    Controller,
    Get,
    Post,
    Body,
    Param,
    Delete,
    UsePipes,
    UseInterceptors,
    ValidationPipe,
    UploadedFiles,
    Put,
} from "@nestjs/common";
import { OfferService } from "./offer.service";
import { ApiOperation, ApiQuery, ApiTags } from "@nestjs/swagger";
import { AuthToken } from "src/config/auth.decorator";

@ApiTags("Offer")
@Controller("api/offer")
export class OfferController {
    constructor(private readonly offerService: OfferService) {}

    @Get(":auction_id")
    findAllOffer(@Param(":auction_id") auction_id: number, @AuthToken() address: string) {
        return this.offerService.findAllOffer(address, auction_id);
    }
}
