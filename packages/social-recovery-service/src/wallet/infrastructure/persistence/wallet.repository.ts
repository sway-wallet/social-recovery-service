import { Wallet } from '../../domain/wallet';
import { NullableType } from 'src/utils/types/nullable.type';
import { FilterWalletDto, SortWalletDto } from '../../dto/query-Wallet.dto';
import { IPaginationOptions } from 'src/utils/types/pagination-options';
import { EntityCondition } from 'src/utils/types/entity-condition.type';
import { DeepPartial } from 'src/utils/types/deep-partial.type';

export abstract class WalletRepository {
  abstract create(
    data: Omit<Wallet, 'id' | 'createdAt' | 'deletedAt' | 'updatedAt'>,
  ): Promise<Wallet>;

  abstract findManyWithPagination({
    filterOptions,
    sortOptions,
    paginationOptions,
  }: {
    filterOptions?: FilterWalletDto | null;
    sortOptions?: SortWalletDto[] | null;
    paginationOptions: IPaginationOptions;
  }): Promise<Wallet[]>;

  abstract findOne(fields: EntityCondition<Wallet>): Promise<NullableType<Wallet>>;

  abstract update(
    id: Wallet['id'],
    payload: DeepPartial<Wallet>,
  ): Promise<Wallet | null>;

  abstract softDelete(id: Wallet['id']): Promise<void>;
}
