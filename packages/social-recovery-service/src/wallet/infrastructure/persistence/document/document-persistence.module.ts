import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { WalletSchema, WalletSchemaClass } from './entities/wallet.schema';
import { WalletRepository } from '../wallet.repository';
import { WalletsDocumentRepository } from './repositories/wallet.repository';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: WalletSchemaClass.name, schema: WalletSchema },
    ]),
  ],
  providers: [
    {
      provide: WalletRepository,
      useClass: WalletsDocumentRepository,
    },
  ],
  exports: [WalletRepository],
})
export class DocumentWalletPersistenceModule {}
