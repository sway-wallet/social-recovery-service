import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityCondition } from 'src/utils/types/entity-condition.type';
import { IPaginationOptions } from 'src/utils/types/pagination-options';
import { FindOptionsWhere, Repository } from 'typeorm';
import { WalletEntity } from '../entities/wallet.entity';
import { NullableType } from '../../../../../utils/types/nullable.type';
import { SortWalletDto } from '../../../../dto/query-wallet.dto';
import { Wallet } from '../../../../domain/wallet';
import { WalletRepository } from '../../wallet.repository';
import { WalletMapper } from '../mappers/wallet.mapper';

@Injectable()
export class WalletRelationalRepository implements WalletRepository {
  constructor(
    @InjectRepository(WalletEntity)
    private readonly WalletRepository: Repository<WalletEntity>,
  ) {}

  async create(data: Wallet): Promise<Wallet> {
    const persistenceModel = WalletMapper.toPersistence(data);
    const newEntity = await this.WalletRepository.save(
      this.WalletRepository.create(persistenceModel),
    );
    return WalletMapper.toDomain(newEntity);
  }

  async findManyWithPagination({
    sortOptions,
    paginationOptions,
  }: {
    sortOptions?: SortWalletDto[] | null;
    paginationOptions: IPaginationOptions;
  }): Promise<Wallet[]> {
    const where: FindOptionsWhere<WalletEntity> = {};

    const entities = await this.WalletRepository.find({
      skip: (paginationOptions.page - 1) * paginationOptions.limit,
      take: paginationOptions.limit,
      where: where,
      order: sortOptions?.reduce(
        (accumulator, sort) => ({
          ...accumulator,
          [sort.orderBy]: sort.order,
        }),
        {},
      ),
    });

    return entities.map((user) => WalletMapper.toDomain(user));
  }

  async findOne(fields: EntityCondition<Wallet>): Promise<NullableType<Wallet>> {
    const entity = await this.WalletRepository.findOne({
      where: fields as FindOptionsWhere<WalletEntity>,
    });

    return entity ? WalletMapper.toDomain(entity) : null;
  }

  async update(id: Wallet['id'], payload: Partial<Wallet>): Promise<Wallet> {
    const entity = await this.WalletRepository.findOne({
      where: { id: id },
    });

    if (!entity) {
      throw new Error('Wallet not found');
    }

    const updatedEntity = await this.WalletRepository.save(
      this.WalletRepository.create(
        WalletMapper.toPersistence({
          ...WalletMapper.toDomain(entity),
          ...payload,
        }),
      ),
    );

    return WalletMapper.toDomain(updatedEntity);
  }

  async softDelete(id: Wallet['id']): Promise<void> {
    await this.WalletRepository.softDelete(id);
  }
}
