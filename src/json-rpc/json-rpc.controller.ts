import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { JsonRpcService } from './json-rpc.service';
import { CreateJsonRpcDto } from './dto/create-json-rpc.dto';
import { UpdateJsonRpcDto } from './dto/update-json-rpc.dto';

@Controller('json-rpc')
export class JsonRpcController {
  constructor(private readonly jsonRpcService: JsonRpcService) {}

  @Post()
  create(@Body() createJsonRpcDto: CreateJsonRpcDto) {
    return this.jsonRpcService.create(createJsonRpcDto);
  }

  @Get()
  findAll() {
    return this.jsonRpcService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.jsonRpcService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateJsonRpcDto: UpdateJsonRpcDto) {
    return this.jsonRpcService.update(+id, updateJsonRpcDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.jsonRpcService.remove(+id);
  }
}
