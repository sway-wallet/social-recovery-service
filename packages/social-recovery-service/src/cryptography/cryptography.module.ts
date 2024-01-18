import { Module } from '@nestjs/common';
import { CryptographyService } from './cryptography.service';
import { CryptographyController } from './cryptography.controller';

@Module({
  providers: [CryptographyService],
  exports: [CryptographyService],
  controllers: [CryptographyController],
})
export class CryptographyModule {}
