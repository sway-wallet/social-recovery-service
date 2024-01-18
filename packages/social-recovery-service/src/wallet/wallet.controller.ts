import { Body, Delete, Controller, HttpCode, HttpStatus, Get, Post, SerializeOptions, Query, Patch, Param } from '@nestjs/common';
import { CreateWalletDto } from './dto/create-wallet.dto';
import { UpdateWalletDto } from './dto/update-wallet.dto';
import { QueryWalletDto } from './dto/query-wallet.dto';
import { WalletService } from './wallet.service';
import { InfinityPaginationResultType } from 'src/utils/types/infinity-pagination-result.type';
import { infinityPagination } from 'src/utils/infinity-pagination';
import { Wallet } from './domain/wallet';
import { ApiParam } from '@nestjs/swagger';

@Controller('wallet')
export class WalletController {
  constructor(private readonly walletService: WalletService) {}

  @SerializeOptions({
    groups: ['admin'],
  })
  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createWalletDto: CreateWalletDto): Promise<Wallet> {
    return this.walletService.create(createWalletDto);
  }

  @SerializeOptions({
    groups: ['admin'],
  })
  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll(
    @Query() query: QueryWalletDto,
  ): Promise<InfinityPaginationResultType<Wallet>> {
    const page = query?.page ?? 1;
    let limit = query?.limit ?? 10;
    if (limit > 50) {
      limit = 50;
    }

    return infinityPagination(
      await this.walletService.findManyWithPagination({
        sortOptions: query?.sort,
        paginationOptions: {
          page,
          limit,
        },
      }),
      { page, limit },
    );
  }

  @SerializeOptions({
    groups: ['admin'],
  })
  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
  })
  update(
    @Param('id') id: Wallet['id'],
    @Body() updateWalletDto: UpdateWalletDto,
  ): Promise<Wallet | null> {
    return this.walletService.update(id, updateWalletDto);
  }

  @Delete(':id')
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: Wallet['id']): Promise<void> {
    return this.walletService.softDelete(id);
  }
}
