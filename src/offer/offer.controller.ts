import { Controller, Get, Post, Body, Patch, Param, Delete } from "@nestjs/common";
import { OfferGateway } from "./offer.gateway";
import { CreateOfferDto } from "./dto/create-offer.dto";
import { UpdateOfferDto } from "./dto/update-offer.dto";

@Controller("offer")
export class OfferController {
    constructor(private readonly offerGateway: OfferGateway) {}

    // @Post()
    // create(@Body() createOfferDto: CreateOfferDto) {
    //     return this.offerGateway.create(createOfferDto);
    // }

    // @Get()
    // findAll() {
    //     return this.offerGateway.findAll();
    // }

    // @Get(":id")
    // findOne(@Param("id") id: string) {
    //     return this.offerGateway.findOne(+id);
    // }

    // @Patch(":id")
    // update(@Param("id") id: string, @Body() updateOfferDto: UpdateOfferDto) {
    //     return this.offerGateway.update(+id, updateOfferDto);
    // }

    // @Delete(":id")
    // remove(@Param("id") id: string) {
    //     return this.offerGateway.remove(+id);
    // }
}
