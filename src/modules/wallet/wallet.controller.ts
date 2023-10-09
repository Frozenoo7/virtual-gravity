import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';

import { JwtAuthGuard } from 'auth/guards';

import { WalletService } from './wallet.service';
import { CreateWalletDto } from './dtos';

@Controller('wallet')
@UseGuards(JwtAuthGuard)
export class WalletController {
  constructor(private readonly walletService: WalletService) {}

  @Post()
  public async createWallet(@Body() body: CreateWalletDto, @Req() req) {
    const userId = req.user._id;
    return await this.walletService.createWallet(userId, body);
  }

  @Get()
  public async findAllWallet(@Req() req) {
    const userId = req.user._id;
    return await this.walletService.findAllWallet(userId);
  }

  @Get('stats/:id')
  public async findWalletBalanceStats(@Param('id') id: string, @Query() query) {
    return await this.walletService.findWalletBalanceStats(id, query);
  }

  @Get(':id')
  public async findWalletById(@Param('id') id: string) {
    return await this.walletService.findWalletById(id);
  }

  @Patch(':id')
  public async updateWallet(
    @Body() body: CreateWalletDto,
    @Param('id') id: string,
  ) {
    return await this.walletService.updateWallet(id, body);
  }

  @Delete(':id')
  public async deleteWallet(@Param('id') id: string) {
    return await this.walletService.deleteWallet(id);
  }
}
