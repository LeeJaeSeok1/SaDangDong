import { Injectable } from '@nestjs/common';
import { CreateAuthorUserDto } from './dto/createAuthorUser.dto';
import { UpdateAuthorUserDto } from './dto/updateAuthorUser.dto';

@Injectable()
export class AuthorUsersService {
  create(createAuthorUserDto: CreateAuthorUserDto) {
    return 'This action adds a new authorUser';
  }

  findAll() {
    return `This action returns all authorUsers`;
  }

  findOne(id: number) {
    return `This action returns a #${id} authorUser`;
  }

  update(id: number, updateAuthorUserDto: UpdateAuthorUserDto) {
    return `This action updates a #${id} authorUser`;
  }

  remove(id: number) {
    return `This action removes a #${id} authorUser`;
  }
}
