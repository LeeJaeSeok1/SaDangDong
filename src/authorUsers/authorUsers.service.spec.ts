import { Test, TestingModule } from '@nestjs/testing';
import { AuthorUsersService } from './authorUsers.service';

describe('AuthorUsersService', () => {
  let service: AuthorUsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AuthorUsersService],
    }).compile();

    service = module.get<AuthorUsersService>(AuthorUsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
