import { Transform, Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional } from 'class-validator';

export class CreateWalletDto {
    @ApiProperty()
    @IsNotEmpty()
    userId: string;
    
    @ApiProperty()
    @IsOptional()
    publicKey?: string;

    @ApiProperty()
    @IsOptional()
    encodedPrivateKeySeed?: string;

    @ApiProperty()
    @IsOptional()
    encodedSeed?: string;
}