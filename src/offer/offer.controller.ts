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

    @Post(":auction_id")
    createOffers(@Param("auction_id") auction_id: number, @AuthToken() address: string, @Body() data) {
        return this.offerService.createOffer(auction_id, address, data);
    }

    @Get(":auction_id")
    findAllOffer(@Param("auction_id") auction_id: number, @AuthToken() address: string) {
        return this.offerService.findAllOffer(address, auction_id);
    }
}
