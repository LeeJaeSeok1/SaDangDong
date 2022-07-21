import { Injectable } from '@nestjs/common';
import { CreateJsonRpcDto } from './dto/create-json-rpc.dto';
import { UpdateJsonRpcDto } from './dto/update-json-rpc.dto';

@Injectable()
export class JsonRpcService {
  create(createJsonRpcDto: CreateJsonRpcDto) {
    return 'This action adds a new jsonRpc';
  }

  findAll() {
    return `This action returns all jsonRpc`;
  }

  findOne(id: number) {
    return `This action returns a #${id} jsonRpc`;
  }

  update(id: number, updateJsonRpcDto: UpdateJsonRpcDto) {
    return `This action updates a #${id} jsonRpc`;
  }

  remove(id: number) {
    return `This action removes a #${id} jsonRpc`;
  }
}
