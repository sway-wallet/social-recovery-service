import { Injectable } from '@nestjs/common';
import { createCipheriv, createDecipheriv, randomBytes, scryptSync } from 'crypto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class CryptographyService {
  private readonly ivsUsed: Set<Buffer>;

    constructor(private readonly configService: ConfigService) {
      this.ivsUsed = new Set<Buffer>();
    }

    async encrypt(seed: string):Promise<string> {
      const iv: Buffer = randomBytes(16);
      if (this.ivsUsed.has(iv)) {
        throw new Error('IV reuse detected');
      }
      this.ivsUsed.add(iv);

      const password: Buffer = Buffer.from(this.configService.getOrThrow<string>('CRYPTO_SECRET_KEY'));
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

    async decrypt(encryptedData: string): Promise<string> {
      const parts: string[] = encryptedData.split(':');
      if (parts.length < 3) {
        throw new Error('Invalid encrypted data format');
      }
      const iv: Buffer = Buffer.from(parts[0], 'hex');
      const encryptedText: Buffer = Buffer.from(parts[1], 'hex');
      const authTag: Buffer = Buffer.from(parts[2], 'hex');

      const password: Buffer = Buffer.from(this.configService.getOrThrow<string>('CRYPTO_SECRET_KEY'));
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
