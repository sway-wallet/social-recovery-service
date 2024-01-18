import { Injectable } from '@nestjs/common';
import { CryptographyService } from 'src/cryptography/cryptography.service';
import { UsersService } from '../users/users.service';
import { Wallet } from './domain/wallet';
import { CreateWalletDto } from './dto/create-wallet.dto';
import { WalletRepository } from './infrastructure/persistence/wallet.repository';
import { User } from 'src/users/domain/user';
import { NullableType } from 'src/utils/types/nullable.type';

@Injectable()
export class WalletService {
    constructor(
        private readonly cryptographyService:CryptographyService,
        private readonly usersService: UsersService,
        private readonly walletRepository: WalletRepository,
    ) {}

    async create(createWalletDto: CreateWalletDto): Promise<Wallet> {
        const clonedPayload: CreateWalletDto = {
            ...createWalletDto,
        };
        const userId: string = createWalletDto.userId;
        let user: NullableType<User> = null;
        if (!userId) {
            throw new Error('User id is required');
        } else {
            //check if user exists
            user = await this.usersService.findOne({id: userId});
            if (!user) {
                throw new Error('User not found');
            }
        }
        const encodedSeed: string | undefined = clonedPayload.encodedSeed;
        const encodedPrivateKeySeed: string | undefined = clonedPayload.encodedPrivateKeySeed;
        let encryptedSeed: string | null = null;
        let encryptedPrivateKeySeed: string | null = null;
        
        if (encodedSeed) {
            encryptedSeed = await this.cryptographyService.encrypt(encodedSeed + ':' +user.id);
        }

        if (encodedPrivateKeySeed) {
            encryptedPrivateKeySeed = await this.cryptographyService.encrypt(encodedPrivateKeySeed + ':' +user.id);
        }

        return this.walletRepository.create(clonedPayload);
    }

    async findOne(condition: any): Promise<NullableType<Wallet>> {
        const wallet: NullableType<Wallet> = await this.walletRepository.findOne(condition);
        let result: Wallet = new Wallet();
        if (wallet?.encryptedPrivateKeySeed) {
            const encryptedPrivateKeySeed: string = await this.cryptographyService.decrypt(wallet.encryptedPrivateKeySeed);
            const [encodedPrivateKeySeed] = encryptedPrivateKeySeed.split(':');
            result.encryptedPrivateKeySeed = encodedPrivateKeySeed;
        }

        if (wallet?.encryptedSeed) {
            const encryptedSeed: string = await this.cryptographyService.decrypt(wallet.encryptedSeed);
            const [encodedSeed] = encryptedSeed.split(':');
            result.encryptedSeed = encodedSeed;
        }
        return this.walletRepository.findOne(condition);
    }
}
