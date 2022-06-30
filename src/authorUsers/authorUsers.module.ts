import { Module } from '@nestjs/common';
import { AuthorUsersService } from './authorUsers.service';
import { AuthorUsersController } from './authorUsers.controller';

@Module({
  controllers: [AuthorUsersController],
  providers: [AuthorUsersService]
})
export class AuthorUsersModule {}
