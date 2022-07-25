import { Controller, Get, Post, Body, Patch, Param, Delete } from "@nestjs/common";
import { SellService } from "./sell.service";
import { CreateSellDto } from "./dto/create-sell.dto";
import { UpdateSellDto } from "./dto/update-sell.dto";

@Controller("api/sell")
export class SellController {
    constructor(private readonly sellService: SellService) {}

    @Post(":auction_id")
    SellComplete(@Body() createSellDto: CreateSellDto, @Param("auction_id") auction_id: number) {
        return this.sellService.SellComplete(createSellDto, auction_id);
    }

    @Get()
    findAll() {
        return this.sellService.findAll();
    }
}
