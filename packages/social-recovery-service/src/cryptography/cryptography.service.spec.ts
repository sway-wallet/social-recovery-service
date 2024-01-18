import { Test, TestingModule } from '@nestjs/testing';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CryptographyService } from './cryptography.service';

describe('CryptographyService', () => {
  let service: CryptographyService;
  let configService: ConfigService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule.forRoot()],
      providers: [
        CryptographyService,
        ConfigService,
      ],
    }).compile();

    configService = module.get<ConfigService>(ConfigService);
    service = module.get<CryptographyService>(CryptographyService);
  });

  it('should be defined', () => {
    expect(configService).toBeDefined();
    expect(service).toBeDefined();
  });

  it('should encrypt and decrypt', async () => {
    const key:string = configService.get<string>('CRYPTO_SECRET_KEY')?.toString() || 'test';
    const encrypted = await service.encrypt(key);
    const decrypted = await service.decrypt(encrypted);
    expect(decrypted).toEqual(key);
  });
});
