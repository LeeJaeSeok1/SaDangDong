import { Test, TestingModule } from '@nestjs/testing';
import { AuthorUsersController } from './authorUsers.controller';
import { AuthorUsersService } from './authorUsers.service';

describe('AuthorUsersController', () => {
  let controller: AuthorUsersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthorUsersController],
      providers: [AuthorUsersService],
    }).compile();

    controller = module.get<AuthorUsersController>(AuthorUsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
