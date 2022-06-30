import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ExploreService } from './explore.service';
import { CreateExploreDto } from './dto/create-explore.dto';
import { UpdateExploreDto } from './dto/update-explore.dto';

@Controller('explore')
export class ExploreController {
  constructor(private readonly exploreService: ExploreService) {}

  @Post()
  create(@Body() createExploreDto: CreateExploreDto) {
    return this.exploreService.create(createExploreDto);
  }

  @Get()
  findAll() {
    return this.exploreService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.exploreService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateExploreDto: UpdateExploreDto) {
    return this.exploreService.update(+id, updateExploreDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.exploreService.remove(+id);
  }
}
