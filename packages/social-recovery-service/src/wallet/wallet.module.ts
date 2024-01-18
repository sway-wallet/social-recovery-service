import { Module } from '@nestjs/common';
import { WalletService } from './wallet.service';
import { WalletController } from './wallet.controller';
import databaseConfig from 'src/database/config/database.config';
import { DatabaseConfig } from 'src/database/config/database-config.type';
import { DocumentWalletPersistenceModule } from 'src/wallet/infrastructure/persistence/document/document-persistence.module';
import { RelationalWalletPersistenceModule } from 'src/wallet/infrastructure/persistence/relational/relational-persistence.module';
import { FilesModule } from 'src/files/files.module';
import { UsersModule } from 'src/users/users.module';
import { CryptographyModule } from 'src/cryptography/cryptography.module';

const infrastructurePersistenceModule = (databaseConfig() as DatabaseConfig)
  .isDocumentDatabase
  ? DocumentWalletPersistenceModule
  : RelationalWalletPersistenceModule;
  
@Module({
  imports: [CryptographyModule, infrastructurePersistenceModule, FilesModule, UsersModule],
  providers: [WalletService],
  controllers: [WalletController],
  exports: [WalletService, infrastructurePersistenceModule],
})
export class WalletModule {}
