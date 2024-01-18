import { Wallet } from '../../../../domain/wallet';
import { WalletSchemaClass } from '../entities/wallet.schema';

export class WalletMapper {
  static toDomain(raw: WalletSchemaClass): Wallet {
    const wallet = new Wallet();
    wallet.id = raw._id.toString();
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

  static toPersistence(wallet: Wallet): WalletSchemaClass {

    const walletEntity = new WalletSchemaClass();
    if (wallet.id && typeof wallet.id === 'string') {
      walletEntity._id = wallet.id;
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
