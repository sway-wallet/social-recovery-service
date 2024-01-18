import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CryptographyService } from 'src/cryptography/cryptography.service';
import { UsersService } from '../users/users.service';
import { Wallet } from './domain/wallet';
import { CreateWalletDto } from './dto/create-wallet.dto';
import { WalletRepository } from './infrastructure/persistence/wallet.repository';
import { NullableType } from 'src/utils/types/nullable.type';
import { SortWalletDto } from './dto/query-wallet.dto';
import { IPaginationOptions } from 'src/utils/types/pagination-options';
import { DeepPartial } from 'typeorm';
import { DiffieHellman } from 'crypto';

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
    let user: NullableType<Wallet> = null;
    if (!userId) {
      throw new Error('Wallet id is required');
    } else {
      //check if user exists
      user = await this.usersService.findOne({id: userId});
      if (!user) {
        throw new Error('Wallet not found');
      }
    }

    // DeffieHellman encryption
    const deffieHellmanSessionId: string = clonedPayload.diffieHellmanSessionId;

    if (!deffieHellmanSessionId) {
      throw new Error('deffieHellmanSessionId is required');
    }

    const deffieHellmanPublicKey: string = clonedPayload.diffieHellmanSessionId;
    if (!deffieHellmanPublicKey) {
      throw new Error('deffieHellmanPublicKey is required');
    }

    const sharedKey = this.cryptographyService.exchangeDiffieHellman(deffieHellmanSessionId, deffieHellmanPublicKey);
    if (!sharedKey) {
      throw new Error('sharedKey is required');
    }

    const diffieHellmanEncryptedPrivateKeySeed = clonedPayload.diffieHellmanEncryptedPrivateKeySeed;
    if (diffieHellmanEncryptedPrivateKeySeed) {
      //const decryptedPrivateKeySeed
    }

    const diffieHellmanEncryptedSeed = clonedPayload.diffieHellmanEncryptedSeed;
    if (diffieHellmanEncryptedSeed) {
      //const decryptedSeed
    }

    const encryptedSeed: string | null = await this.cryptographyService.encryptAes256Gcm(decryptedSeed + ':' +user.id);
    const encryptedPrivateKeySeed: string | null = await this.cryptographyService.encryptAes256Gcm(decryptedPrivateKeySeed + ':' +user.id);

    return this.walletRepository.create(clonedPayload);
  }

  findManyWithPagination({
      sortOptions,
      paginationOptions,
    }: {
      sortOptions?: SortWalletDto[] | null;
      paginationOptions: IPaginationOptions;
    }): Promise<Wallet[]> {
      return this.walletRepository.findManyWithPagination({
        sortOptions,
        paginationOptions,
      });
    }

  async findOne(condition: any): Promise<NullableType<Wallet>> {
      const wallet: NullableType<Wallet> = await this.walletRepository.findOne(condition);
      let result: Wallet = new Wallet();
      if (wallet?.encryptedPrivateKeySeed) {
        const encryptedPrivateKeySeed: string = await this.cryptographyService.decryptAes256Gcm(wallet.encryptedPrivateKeySeed);
        const [encodedPrivateKeySeed] = encryptedPrivateKeySeed.split(':');
        result.encryptedPrivateKeySeed = encodedPrivateKeySeed;
      }

      if (wallet?.encryptedSeed) {
        const encryptedSeed: string = await this.cryptographyService.decryptAes256Gcm(wallet.encryptedSeed);
        const [encodedSeed] = encryptedSeed.split(':');
        result.encryptedSeed = encodedSeed;
      }
      return this.walletRepository.findOne(condition);
  }

  async update(
      id: Wallet['id'],
      payload: DeepPartial<Wallet>,
    ): Promise<Wallet | null> {
      const clonedPayload = { ...payload };
  
      if (clonedPayload.publicKey) {
        const walletObject = await this.walletRepository.findOne({
          publicKey: clonedPayload.publicKey,
        });
        if (walletObject?.id !== id) {
          throw new HttpException(
            {
              status: HttpStatus.UNPROCESSABLE_ENTITY,
              errors: {
                publicKey: 'publicKeyAlreadyExists',
              },
            },
            HttpStatus.UNPROCESSABLE_ENTITY,
          );
        }
      }
  
      return this.walletRepository.update(id, clonedPayload);
    }

  async softDelete(id: Wallet['id']): Promise<void> {
      await this.walletRepository.softDelete(id);
  }
}
