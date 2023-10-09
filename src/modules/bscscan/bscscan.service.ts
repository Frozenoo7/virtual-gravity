import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { HttpService } from '@nestjs/axios';
import { Model } from 'mongoose';
import { Cron } from '@nestjs/schedule';

import { ConfigurationService } from 'configuration/configuration.service';
import {
  HistoricalBalanceDocument,
  RecentBalanceDocument,
  WalletDocument,
} from 'database/models';

@Injectable()
export class BscscanService {
  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigurationService,
    @InjectModel('Wallet') private readonly wallerModel: Model<WalletDocument>,
    @InjectModel('RecentBalance')
    private readonly recentBalanceModel: Model<RecentBalanceDocument>,
    @InjectModel('HistoricalBalance')
    private readonly historicalBalanceModel: Model<HistoricalBalanceDocument>,
  ) {}

  @Cron('5 * * * * *')
  public async fetchWalletBalance() {
    console.log('cron job is running:');
    const apiKey = this.configService.bscscanApiKey;
    const allWalletAddress = await this.wallerModel.find(
      {},
      { _id: 1, address: 1 },
    );

    allWalletAddress.map(async (wallet) => {
      const { _id, address } = wallet;
      const apiUrl = `https://api.bscscan.com/api?module=account&action=balance&address=${address}&tag=latest&apikey=${apiKey}`;
      let response;
      try {
        response = await this.httpService.get(apiUrl).toPromise();
      } catch (err) {
        console.log('error in fetching balance', err);
      }

      const result = parseFloat(response?.data?.result);

      const recentBalance = await this.recentBalanceModel.findOne({
        wallet: _id,
      });
      if (recentBalance) {
        const { balance } = recentBalance;
        await this.historicalBalanceModel.create({
          wallet: _id,
          balance,
        });

        if (response.data.status === '1' && !isNaN(result)) {
          return await this.recentBalanceModel.findByIdAndUpdate(
            recentBalance._id,
            {
              $set: {
                balance,
              },
            },
          );
        }
        return;
      }
      if (response.data.status === '1' && !isNaN(result)) {
        return await this.recentBalanceModel.create({
          wallet: _id,
          balance: result,
        });
      }
    });
  }
}
