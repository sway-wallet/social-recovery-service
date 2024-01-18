import { Controller, HttpCode, HttpStatus, Param, Post, SerializeOptions } from '@nestjs/common';
import { CryptographyService } from './cryptography.service';
import { ApiParam } from '@nestjs/swagger';

@Controller({
  path: 'cryptography',
  version: '1',
})
export class CryptographyController {
  constructor(private readonly cryptographyService: CryptographyService) {}

  @SerializeOptions({
    groups: ['admin'],
  })
  @Post()
  @HttpCode(HttpStatus.CREATED)
  start(): Promise<{ sessionId: string, prime: string, generator: string, publicKey: string}> {
    return this.cryptographyService.createDiffieHellman();
  }

  @SerializeOptions({
    groups: ['admin'],
  })
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiParam({
    name: 'sessionId',
    type: String,
    required: true,
  })
  @ApiParam({
    name: 'clientPublicKey',
    type: String,
    required: true,
  })
  exchangeDiffieHellman(
    @Param('sessionId') sessionId: string,
    @Param('clientPublicKey') clientPublicKey: string,
  ): Promise<string> {
    return this.cryptographyService.exchangeDiffieHellman(sessionId, clientPublicKey);
  }
}
