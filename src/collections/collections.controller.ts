import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CollectionsService } from './collections.service';
import { CreateCollectionDto } from './dto/create-collection.dto';
import { UpdateCollectionDto } from './dto/update-collection.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';


@ApiTags('Collections')
@Controller('api/collections')
export class CollectionsController {
  constructor(private readonly collectionsService: CollectionsService) {}

  @ApiOperation({ summary: '컬렉션 생성', description:'컬렉션 생성 페이지'})
  @Post()
  create(@Body() createCollectionDto: CreateCollectionDto) {
    return this.collectionsService.create(createCollectionDto);
  }

  @ApiOperation({ summary: '컬렉션 디테일', description:'컬렉션에 아이템들 보는 페이지'})
  @Get('collection/:collectionName')
  findOne(@Param('collectionName') collectionName: string) {
    return this.collectionsService.findOne(+collectionName);
  }
}
