import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { HistoricalBalanceSchema, WalletSchema } from 'database/models';

import { WalletController } from './wallet.controller';
import { WalletService } from './wallet.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Wallet', schema: WalletSchema },
      { name: 'HistoricalBalance', schema: HistoricalBalanceSchema },
    ]),
  ],
  controllers: [WalletController],
  providers: [WalletService],
})
export class WalletModule {}
