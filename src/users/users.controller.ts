import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  Put,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';

@ApiTags('Account')
@Controller('api/account')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }
  
  @ApiOperation({ summary: '유저로그인', description:'유저 로그인 페이지'})
  @Post('/auth')
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @ApiQuery({ name: 'tab', required: true, description: 'tab= collection, item, favorites'})
  @ApiOperation({ summary: 'USER 페이지', description:'유저 collection, item, favorites 페이지'})
  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @ApiOperation({ summary: 'USER 정보수정 페이지', description:'유저 정보수정 페이지'})
  @Put('settings')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(+id, updateUserDto);
  }

  @ApiOperation({ summary: 'USER 컬렉션 수정 페이지', description:'유저 컬렉션수정 페이지'})
  @Put('collection/:collectionName/edit')
  collectionPut(@Param('collecitonName') collecitonName: string) {
    return this.usersService.remove(+collecitonName);
  }

  @ApiOperation({ summary: 'USER 컬렉션 삭제 페이지', description:'유저 컬렉션 삭제 페이지'})
  @Put('collection/:collectionName/edit')
  collectionDelete(@Param('collectionName') collectionName: string) {
    return this.usersService.remove(+collectionName);
  }
}
