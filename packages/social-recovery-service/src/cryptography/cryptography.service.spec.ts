import { Test, TestingModule } from '@nestjs/testing';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CryptographyService } from './cryptography.service';
import { createDiffieHellman } from 'crypto';

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
    const encrypted = await service.encryptAes256Gcm(key);
    const decrypted = await service.decryptAes256Gcm(encrypted);
    expect(decrypted).toEqual(key);
  });

  it('should create a shared secret', async () => {
    const { sessionId, prime, generator, publicKey } = await service.createDiffieHellman();
    expect(sessionId).toBeDefined();
    expect(prime).toBeDefined();
    expect(generator).toBeDefined();
    expect(publicKey).toBeDefined();
    const sharedSecret: string = await service.exchangeDiffieHellman(sessionId, publicKey);
    expect(sharedSecret).toBeDefined();
  });

  it('should encrypt and decrypt with shared secret', async () => {
    // Step 1: Server creates a Diffie-Hellman instance and sends parameters to client
    const { sessionId, prime, generator, publicKey } = await service.createDiffieHellman();

    // Step 2: Client generates its own Diffie-Hellman keys using server's parameters
    const clientDH = createDiffieHellman(Buffer.from(prime, 'hex'), Buffer.from(generator, 'hex'));
    const clientPrivateKey = clientDH.generateKeys();
    expect(clientPrivateKey).toBeDefined();
    const clientPublicKey = clientDH.getPublicKey();

    // Step 3: Server and client exchange public keys and compute the shared secret
    const serverSharedSecret: string = await service.exchangeDiffieHellman(sessionId, clientPublicKey.toString('hex'));
    const clientSharedSecret = clientDH.computeSecret(Buffer.from(publicKey, 'hex')).toString('hex');

    // Ensure both parties have the same shared secret
    expect(clientSharedSecret).toEqual(serverSharedSecret);

    // Step 4: Encrypt and decrypt a test message using the shared secret
    const testMessage = 'Test message for encryption';
    const encrypted = await service.encryptAes256Gcm(testMessage, clientSharedSecret);
    const decrypted = await service.decryptAes256Gcm(encrypted, clientSharedSecret);

    // Validate the decrypted message is the same as the original
    expect(decrypted).toEqual(testMessage);
  });
});
