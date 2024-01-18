import { Injectable } from '@nestjs/common';
import { EntityCondition } from 'src/utils/types/entity-condition.type';
import { IPaginationOptions } from 'src/utils/types/pagination-options';
import { NullableType } from '../../../../../utils/types/nullable.type';
import { SortWalletDto } from '../../../../dto/query-wallet.dto';
import { Wallet } from '../../../../domain/wallet';
import { WalletRepository } from '../../wallet.repository';
import { WalletSchemaClass } from '../entities/wallet.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { WalletMapper } from '../mappers/wallet.mapper';

@Injectable()
export class WalletsDocumentRepository implements WalletRepository {
  constructor(
    @InjectModel(WalletSchemaClass.name)
    private readonly walletsModel: Model<WalletSchemaClass>,
  ) {}

  async create(data: Wallet): Promise<Wallet> {
    const persistenceModel = WalletMapper.toPersistence(data);
    const createdWallet = new this.walletsModel(persistenceModel);
    const walletObject = await createdWallet.save();
    return WalletMapper.toDomain(walletObject);
  }

  async findManyWithPagination({
    sortOptions,
    paginationOptions,
  }: {
    sortOptions?: SortWalletDto[] | null;
    paginationOptions: IPaginationOptions;
  }): Promise<Wallet[]> {
    const where: EntityCondition<Wallet> = {};

    const walletObjects = await this.walletsModel
      .find(where)
      .sort(
        sortOptions?.reduce(
          (accumulator, sort) => ({
            ...accumulator,
            [sort.orderBy === 'id' ? '_id' : sort.orderBy]:
              sort.order.toUpperCase() === 'ASC' ? 1 : -1,
          }),
          {},
        ),
      )
      .skip((paginationOptions.page - 1) * paginationOptions.limit)
      .limit(paginationOptions.limit);

    return walletObjects.map((walletObject) => WalletMapper.toDomain(walletObject));
  }

  async findOne(fields: EntityCondition<Wallet>): Promise<NullableType<Wallet>> {
    if (fields.id) {
      const walletObject = await this.walletsModel.findById(fields.id);
      return walletObject ? WalletMapper.toDomain(walletObject) : null;
    }

    const walletObject = await this.walletsModel.findOne(fields);
    return walletObject ? WalletMapper.toDomain(walletObject) : null;
  }

  async update(id: Wallet['id'], payload: Partial<Wallet>): Promise<Wallet | null> {
    const clonedPayload = { ...payload };
    delete clonedPayload.id;

    const filter = { _id: id };
    const walletObject = await this.walletsModel.findOneAndUpdate(
      filter,
      clonedPayload,
    );

    return walletObject ? WalletMapper.toDomain(walletObject) : null;
  }

  async softDelete(id: Wallet['id']): Promise<void> {
    await this.walletsModel.deleteOne({
      _id: id,
    });
  }
}
