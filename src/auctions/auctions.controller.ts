import { Controller, Get, Post, Body, Param } from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { AuthToken } from "src/config/auth.decorator";
import { AuctionsService } from "./auctions.service";
import { CreateAuctionDto } from "./dto/createAuction.dto";
import { Auction } from "./entities/auction.entity";

@ApiTags("Auction")
@Controller("api/auction")
export class AuctionsController {
    constructor(private readonly auctionsService: AuctionsService) {}

    @ApiOperation({
        summary: "경매 등록",
        description: "경매에 아이템 등록하기",
    })
    @Post(":token_id")
    createAuction(
        @Param("token_id") token_id: string,
        @AuthToken() address: string,
        @Body() createAuctionDto: CreateAuctionDto,
    ) {
        return this.auctionsService.startAuction(token_id, createAuctionDto, address);
    }

    @ApiOperation({ summary: "경매중인 아이템 전체보기" })
    @Get()
    getAllAcution(): Promise<Auction[]> {
        return this.auctionsService.getAllAuction();
    }

    @ApiOperation({
        summary: "경매 참여",
        description: "경매중인 아이템에 경매 참여",
    })
    @Get(":token_id")
    Auction_detail(@Param("token_id") token_id: string) {
        return this.auctionsService.getOneAuction(token_id);
    }

    // @ApiOperation({
    //     summary: "경매 채팅",
    //     description: "경매중인 아이템에 채팅리스트",
    // })
    // @Get(":NFTtoken/chatting")
    // findChatting(@Param("NFTtoken") NFTtoken: string) {
    //     return this.auctionsService.findOne(+NFTtoken);
    // }

    // @ApiOperation({
    //     summary: "경매 채팅",
    //     description: "경매중인 아이템에 채팅리스트",
    // })
    // @Get(":NFTtoken/offer")
    // findOffer(@Param("NFTtoken") NFTtoken: string) {
    //     return this.auctionsService.findOne(+NFTtoken);
    // }
}
