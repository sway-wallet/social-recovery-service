import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { User } from './domain/user';

const user = new User();
user.firstName = `Tester${Date.now()}`;
user.lastName = 'Unit test';
user.email = `User.${Date.now()}@test.com`;
user.password = 'secret';

describe('UsersService', () => {
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UsersService],
    }).compile();

    service = module.get<UsersService>(UsersService);
    service.create(user);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create user', async () => {
    const newUser = new User();
    newUser.firstName = `Another Tester${Date.now()}`;
    user.lastName = 'Another Unit test';
    user.email = `User.${Date.now()}@test.com`;
    user.password = 'secret';

    const createdUser = await service.create(user);
    expect(createdUser).toBeDefined();
    expect(createdUser.email).toBe(newUser.email);
    expect(createdUser.password).toBe(newUser.password);
  });

  it('should find user', async () => {
    const foundUser = await service.findOne({ email: user.email });
    expect(foundUser).toBeDefined();
    expect(foundUser?.email).toBe(user.email);
  });
});