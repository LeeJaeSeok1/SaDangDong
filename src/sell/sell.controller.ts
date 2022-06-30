import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { SellService } from './sell.service';
import { CreateSellDto } from './dto/create-sell.dto';
import { UpdateSellDto } from './dto/update-sell.dto';

@Controller('sell')
export class SellController {
  constructor(private readonly sellService: SellService) {}

  @Post()
  create(@Body() createSellDto: CreateSellDto) {
    return this.sellService.create(createSellDto);
  }

  @Get()
  findAll() {
    return this.sellService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.sellService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateSellDto: UpdateSellDto) {
    return this.sellService.update(+id, updateSellDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.sellService.remove(+id);
  }
}
