import { PartialType } from '@nestjs/swagger';
import { CreateWalletDto } from './create-wallet.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

export class UpdateWalletDto extends PartialType(CreateWalletDto) {
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
