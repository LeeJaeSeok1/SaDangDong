import { Controller, Get, Post, Body, Patch, Param, Delete } from "@nestjs/common";
import { SellService } from "./sell.service";
import { CreateSellDto } from "./dto/create-sell.dto";
import { UpdateSellDto } from "./dto/update-sell.dto";
import { AuthToken } from "src/config/auth.decorator";

@Controller("api/sell")
export class SellController {
    constructor(private readonly sellService: SellService) {}

    @Post(":auction_id")
    SellComplete(@Body() price: number, @Param("auction_id") auction_id: number, @AuthToken() address: string) {
        return this.sellService.SellComplete(price, auction_id, address);
    }

    @Get()
    findAll() {
        return this.sellService.findAll();
    }
}
