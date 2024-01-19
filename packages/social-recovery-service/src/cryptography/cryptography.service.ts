import { Injectable } from '@nestjs/common';
import { DiffieHellman, createCipheriv, createDecipheriv, createDiffieHellman, randomBytes, scryptSync } from 'crypto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class CryptographyService {
  private readonly ivsUsed: Set<Buffer>;
  // Store server's DiffieHellman instances by session ID
  private readonly serverDHInstances: Record<string, DiffieHellman>;
  private readonly sharedSecret: Record<string, string>;


  constructor(private readonly configService: ConfigService) {
    this.ivsUsed = new Set<Buffer>();
    this.serverDHInstances = {};
    this.sharedSecret = {};
  }

  async getDiffieHellmanSharedKey(sessionId: string): Promise<string> {
    if (!sessionId) {
      throw new Error('Session ID is required');
    }
    if (!this.sharedSecret[sessionId]) {
      throw new Error('Invalid session ID');
    }
    return this.sharedSecret[sessionId];
  }

  async createDiffieHellman(): Promise<{ sessionId: string, prime: string, generator: string, publicKey: string}> {
    const sessionId: string = randomBytes(16).toString('hex');
    console.log('sessionId', sessionId);
    const serverDH: DiffieHellman = createDiffieHellman(2048);
    const serverPublicKey: Buffer = serverDH.generateKeys();
    console.log('serverPublicKey', serverPublicKey.toString('hex'));

     // Save the instance with the session ID
     this.serverDHInstances[sessionId] = serverDH;

    return {
      sessionId,
      prime: serverDH.getPrime().toString('hex'), 
      generator: serverDH.getGenerator().toString('hex'),
      publicKey: serverPublicKey.toString('hex'),
    }
  }

  async exchangeDiffieHellman(sessionId: string, clientPublicKey: string): Promise<string> {
    if (!sessionId) {
      throw new Error('Session ID is required');
    }
    if (!clientPublicKey) {
      throw new Error('Client public key is required');
    }
    if (!this.serverDHInstances[sessionId]) {
      throw new Error('Invalid session ID');
    }
    const serverDH = this.serverDHInstances[sessionId];

    const clientPublicKeyBuffer: Buffer = Buffer.from(clientPublicKey, 'hex');
    const sharedSecret = serverDH.computeSecret(clientPublicKeyBuffer).toString('hex');
    this.sharedSecret[sessionId] = sharedSecret;
    return sharedSecret;
  }

  async encryptAes256Gcm(seed: string, sessionId? : string):Promise<string> {
    const iv: Buffer = randomBytes(16);
    if (this.ivsUsed.has(iv)) {
      throw new Error('IV reuse detected');
    }
    this.ivsUsed.add(iv);

    let cryptoSecretKey: string = this.configService.getOrThrow<string>('CRYPTO_SECRET_KEY');
    if (sessionId) {
      const sharedSecret: string = await this.getDiffieHellmanSharedKey(sessionId);
      cryptoSecretKey = sharedSecret;
    } 

    const password: Buffer = Buffer.from(cryptoSecretKey);
    const SALT: Buffer = Buffer.from(this.configService.getOrThrow<string>('SALT'));
    const key: Buffer = scryptSync(password, SALT, 32);
    const cipher = createCipheriv('aes-256-gcm', key, iv);

    if (!password || !SALT) {
      throw new Error('Encryption credentials are missing');
    }

    const encryptedText = Buffer.concat([
      cipher.update(seed, 'utf8'),
      cipher.final(),
    ]);
    const authTag = cipher.getAuthTag();
    return iv.toString('hex') + ':' + encryptedText.toString('hex') + ':' + authTag.toString('hex');
  }

  async decryptAes256Gcm(encryptedData: string, sessionId?: string): Promise<string> {
    const parts: string[] = encryptedData.split(':');
    if (parts.length < 3) {
      throw new Error('Invalid encrypted data format');
    }
    const iv: Buffer = Buffer.from(parts[0], 'hex');
    const encryptedText: Buffer = Buffer.from(parts[1], 'hex');
    const authTag: Buffer = Buffer.from(parts[2], 'hex');

    let cryptoSecretKey: string = this.configService.getOrThrow<string>('CRYPTO_SECRET_KEY');
    if (sessionId) {
      const sharedSecret: string = await this.getDiffieHellmanSharedKey(sessionId);
      cryptoSecretKey = sharedSecret;
    } 

    const password: Buffer = Buffer.from(cryptoSecretKey);
    const SALT: Buffer = Buffer.from(this.configService.getOrThrow<string>('SALT'));
    const key = scryptSync(password, SALT, 32);
    const decipher = createDecipheriv('aes-256-gcm', key, iv);
    decipher.setAuthTag(authTag);

    const decryptedText = Buffer.concat([
      decipher.update(encryptedText),
      decipher.final(),
    ]);
    return decryptedText.toString();
  }
}
