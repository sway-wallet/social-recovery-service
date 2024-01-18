import { Test, TestingModule } from '@nestjs/testing';
import { base64 } from '@scure/base';
import { WalletService } from './wallet.service';
import { User } from 'src/users/domain/user';
import { UsersService } from 'src/users/users.service';
import { UsersModule } from 'src/users/users.module';
import { CryptographyService } from 'src/cryptography/cryptography.service';
import { CryptographyModule } from 'src/cryptography/cryptography.module';


const user = new User();
user.id = '1234';
user.email = 'test@test.com';
user.password = 'test';

describe('WalletService', () => {
  let service: WalletService;
  let usersService: UsersService;
  let cryptographyService: CryptographyService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [CryptographyModule, UsersModule],
      providers: [UsersService, WalletService, CryptographyService],
    }).compile();

    service = module.get<WalletService>(WalletService);
    usersService = module.get<UsersService>(UsersService);
    cryptographyService = module.get<CryptographyService>(CryptographyService);

    usersService.create(user);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(usersService).toBeDefined();
    expect(cryptographyService).toBeDefined();
  });

  it('should find user', async () => {
    const foundUser = await usersService.findOne({ email: user.email });
    expect(foundUser).toBeDefined();
    expect(foundUser?.email).toBe(user.email);
  });

  it('should create wallet', async () => {
    const userId = user.id;
    const wallet = await service.create({
      userId: user.id,
      encodedSeed: base64.encode(Buffer.from('encodedSeed')),
      encodedPrivateKeySeed: base64.encode(Buffer.from('encodedPrivateKeySeed')),
    });
    expect(wallet).toBeDefined();
    expect(userId).toBe(user.id);
    expect(wallet.encryptedSeed).toBeDefined();
    expect(wallet.encryptedPrivateKeySeed).toBeDefined();
  });
});
