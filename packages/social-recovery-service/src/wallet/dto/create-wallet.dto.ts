import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional } from 'class-validator';

export class CreateWalletDto {
    @ApiProperty()
    @IsNotEmpty()
    userId: string;

    @ApiProperty()
    @IsNotEmpty()
    sessionPublicKey: string;
    
    @ApiProperty()
    @IsOptional()
    publicKey?: string;

    // @ApiProperty()
    // @IsOptional()
    // encodedPrivateKeySeed?: string;

    // @ApiProperty()
    // @IsOptional()
    // encodedSeed?: string;

    @ApiProperty()
    @IsNotEmpty()
    diffieHellmanSessionId: string;

    @ApiProperty()
    @IsNotEmpty()
    diffieHellmanPublicKey: string;

    @ApiProperty()
    @IsOptional()
    diffieHellmanEncryptedPrivateKeySeed: string;

    @ApiProperty()
    @IsOptional()
    diffieHellmanEncryptedSeed: string;
}