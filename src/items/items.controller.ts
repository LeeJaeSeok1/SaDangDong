import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    Put,
} from '@nestjs/common';
import { ItemsService } from './items.service';
import { CreateItemDto } from './dto/create-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';
import { ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';

@ApiTags('Items')
@Controller('api/items')
export class ItemsController {
    constructor(private readonly itemsService: ItemsService) {}

    @ApiOperation({
        summary: '아이템 민팅',
        description: '아이템 민팅 페이지',
    })
    @Post('minting')
    create(@Body() createItemDto: CreateItemDto) {
        return '여기는 아이템 민팅하는 페이지';
    }

    @ApiOperation({
        summary: '아이템 상세보기',
        description: '아이템 상세보기 페이지',
    })
    @Get(':NFTtocken')
    findOne(@Param('NFTtoken') NFTtoken: string) {
        return `여기는 아이템 #${NFTtoken}의 상세보기`;
    }

    @ApiOperation({
        summary: '아이템 좋아요',
        description: '아이템 좋아요 페이지',
    })
    @Put(':NFTtocken')
    isLike(@Param('NFTtoken') NFTtoken: string) {
        return `여기는 아이템 #${NFTtoken}의 좋아요 누르는 페이지`;
    }

    @ApiOperation({
        summary: '아이템 수정',
        description: '아이템 수정 페이지',
    })
    @Put(':NFTtocken')
    edit(@Param('NFTtoken') NFTtoken: string) {
        return `여기는 아이템 #${NFTtoken}의 수정 페이지`;
    }

    @ApiOperation({
        summary: '아이템 삭제',
        description: '아이템 삭제 페이지',
    })
    @Delete(':NFTtocken')
    remove(@Param('NFTtocken') NFTtoken: string) {
        return `여기는 아이템 #${NFTtoken}의 삭제 페이지`;
    }
}
