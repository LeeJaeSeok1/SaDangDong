import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { AuctionsService } from "./auctions.service";
import { CreateAuctionDto } from "./dto/createAuction.dto";
import { UpdateAuctionDto } from "./dto/updateAuction.dto";

@ApiTags("Auction")
@Controller("api/auction")
export class AuctionsController {
    constructor(private readonly auctionsService: AuctionsService) {}

    @ApiOperation({
        summary: "경매 등록",
        description: "경매에 아이템 등록하기",
    })
    @Post(":NFTtoken")
    create(@Param("NFTtoken") NFTtoken: string, @Body() createAuctionDto: CreateAuctionDto) {
        return this.auctionsService.create(createAuctionDto);
    }

    @ApiOperation({
        summary: "경매 참여",
        description: "경매중인 아이템에 경매 참여",
    })
    @Get(":NFTtoken")
    findAll(@Param("NFTtoken") NFTtoken: string) {
        return this.auctionsService.findOne(+NFTtoken);
    }

    @ApiOperation({
        summary: "경매 채팅",
        description: "경매중인 아이템에 채팅리스트",
    })
    @Get(":NFTtoken/chatting")
    findChatting(@Param("NFTtoken") NFTtoken: string) {
        return this.auctionsService.findOne(+NFTtoken);
    }

    @ApiOperation({
        summary: "경매 채팅",
        description: "경매중인 아이템에 채팅리스트",
    })
    @Get(":NFTtoken/offer")
    findOffer(@Param("NFTtoken") NFTtoken: string) {
        return this.auctionsService.findOne(+NFTtoken);
    }
}
