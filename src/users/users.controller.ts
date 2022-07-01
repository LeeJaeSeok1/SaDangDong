import { Controller, Get, Post, Body, Put, Param, Delete } from '@nestjs/common';
import { UsersService } from './users.service';
// import { CreateUserDto } from './dto/create-user.dto';
// import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

@Controller('users')
export class UsersController {
    constructor(private usersService: UsersService){};

    @Get()
    findAll(): Promise<User[]> {
        return this.usersService.findAll();
    }

    @Get(':nickname')
    findOne(@Param('nickname')nickname: string): string {
        return `This action returns a #${nickname} user`;
    }

    @Post()
    create(@Body() user: User){
        return this.usersService.create(user);
    }

    @Put(':nickname')
    update(@Param('nickname')nickname: string, @Body() user: User){
        this.usersService.update(nickname, user);
        return `This action updates a #${nickname} user`;
    }

    @Delete(':nickname')
    remove(@Param('nickname')nickname: string){
        this.usersService.remove(nickname);
        return `This action removes a #${nickname} user`;
    }
}
