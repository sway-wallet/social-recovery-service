import { RoleEntity } from 'src/roles/infrastructure/persistence/relational/entities/role.entity';
import { Wallet } from '../../../../domain/wallet';
import { WalletEntity } from '../entities/wallet.entity';

export class WalletMapper {
  static toDomain(raw: WalletEntity): Wallet {
    const wallet = new Wallet();
    wallet.id = raw.id;
    wallet.publicKey = raw.publicKey;
    wallet.encryptedPrivateKeySeed = raw.encryptedPrivateKeySeed;
    wallet.previousEncryptedPrivateKeySeed = raw.previousEncryptedPrivateKeySeed;
    wallet.encryptedSeed = raw.encryptedSeed;
    wallet.previousEncryptedSeed = raw.previousEncryptedSeed;
    
    wallet.createdAt = raw.createdAt;
    wallet.updatedAt = raw.updatedAt;
    wallet.deletedAt = raw.deletedAt;
    return wallet;
  }

  static toPersistence(wallet: Wallet): WalletEntity {
    const walletEntity = new WalletEntity();
    if (wallet.id && typeof wallet.id === 'string') {
      walletEntity.id = wallet.id;
    }
    walletEntity.publicKey = wallet.publicKey;
    walletEntity.encryptedPrivateKeySeed = wallet.encryptedPrivateKeySeed;
    walletEntity.previousEncryptedPrivateKeySeed = wallet.previousEncryptedPrivateKeySeed;
    walletEntity.encryptedSeed = wallet.encryptedSeed;
    walletEntity.previousEncryptedSeed = wallet.previousEncryptedSeed;
    walletEntity.createdAt = wallet.createdAt;
    walletEntity.updatedAt = wallet.updatedAt;
    walletEntity.deletedAt = wallet.deletedAt;
    return walletEntity;
  }
}
