import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { MongooseModule } from '@nestjs/mongoose';
import { ScheduleModule } from '@nestjs/schedule';

import {
  WalletSchema,
  RecentBalanceSchema,
  HistoricalBalanceSchema,
} from 'database/models';

import { BscscanService } from './bscscan.service';

@Module({
  imports: [
    HttpModule,
    MongooseModule.forFeature([
      { name: 'Wallet', schema: WalletSchema },
      { name: 'RecentBalance', schema: RecentBalanceSchema },
      { name: 'HistoricalBalance', schema: HistoricalBalanceSchema },
    ]),
    ScheduleModule.forRoot(),
  ],
  providers: [BscscanService],
  exports: [BscscanService],
})
export class BscscanModule {}
