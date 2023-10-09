import { ConflictException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { endOfDay, startOfDay } from 'date-fns';

import { ISuccessResponse } from 'commom/responses';
import { HistoricalBalanceDocument, WalletDocument } from 'database/models';

import { CreateWalletDto } from './dtos';
import { IWalletResponse } from './responses';

@Injectable()
export class WalletService {
  constructor(
    @InjectModel('Wallet') private readonly walletModel: Model<WalletDocument>,
    @InjectModel('HistoricalBalance')
    private readonly historicalBalance: Model<HistoricalBalanceDocument>,
  ) {}

  public async createWallet(
    userId: string,
    body: CreateWalletDto,
  ): Promise<ISuccessResponse> {
    const { name, address } = body;
    await this.checkForExistingWalletAddress(address);

    await this.walletModel.create({ name, address, user: userId });

    return { message: 'Wallet added successfully.' };
  }

  public async findAllWallet(userId: string): Promise<IWalletResponse[]> {
    const allWallet = await this.walletModel.find({ user: userId });

    return allWallet.map((wallet) => this.transformWalletResponse(wallet));
  }

  public async findWalletById(id: string): Promise<IWalletResponse> {
    const wallet = await this.walletModel.findById(id);

    return this.transformWalletResponse(wallet);
  }

  public async findWalletBalanceStats(walletId: string, query) {
    const { dateFrom, dateTo, groupByType } = query;

    const groupBy = {};
    const sort = {};
    switch (groupByType) {
      case 'daily':
        groupBy['daily'] = {
          $dateToString: { format: '%Y-%m-%d', date: '$createdAt' },
        };
        sort['_id.createdAt'] = -1;
        break;

      case 'weekly':
        groupBy['weekNumber'] = {
          $isoWeek: '$createdAt',
        };
        sort['_id.weekNumber'] = -1;
        break;

      case 'monthly':
        groupBy['month'] = {
          $dateToString: { format: '%Y-%m', date: '$createdAt' },
        };
        sort['_id.month'] = -1;
        break;
    }

    const balanceStats = await this.historicalBalance.aggregate([
      {
        $match: {
          wallet: new mongoose.Types.ObjectId(walletId),
          createdAt: {
            $gte: startOfDay(new Date(dateFrom)),
            $lte: endOfDay(new Date(dateTo)),
          },
        },
      },
      {
        $group: {
          _id: {
            ...groupBy,
          },
          balance: { $push: '$balance' },
        },
      },
      { $sort: sort },
    ]);

    return this.balanceChanges(balanceStats);
  }

  public async updateWallet(
    id: string,
    body: CreateWalletDto,
  ): Promise<ISuccessResponse> {
    const { name, address } = body;

    const wallet = await this.walletModel.findById(id);

    if (wallet.address !== address) {
      await this.checkForExistingWalletAddress(address);
    }

    await this.walletModel.findByIdAndUpdate(id, {
      $set: {
        name,
        address,
      },
    });

    return { message: 'Wallet updated successfully.' };
  }

  public async deleteWallet(id: string): Promise<ISuccessResponse> {
    await this.walletModel.findByIdAndDelete(id);

    return { message: 'Wallet deleted successfully.' };
  }

  private async checkForExistingWalletAddress(address: string) {
    const wallet = await this.walletModel.findOne({ address });

    if (wallet) {
      throw new ConflictException('Wallet with same address already exists.');
    }
  }

  private balanceChanges(balanceStats) {
    const changes = [];
    balanceStats.forEach((stats, index) => {
      const { balance } = stats;
      const previousBalance = changes[index - 1];

      if (!previousBalance) {
        changes.push({
          ...stats._id,
          changeBalance: balance[balance.length - 1],
          changePercentage: 0,
        });
      } else {
        if (balance.length === 1) {
          const lastDayValue = balance[0];
          const changeAmount = lastDayValue - previousBalance.changeBalance;
          const changePercentage =
            (changeAmount / previousBalance.changeBalance) * 100;
          changes.push({
            ...stats._id,
            changeBalance: changeAmount,
            changePercentage,
          });
        }
        const lastDayValue = balance[balance.length - 1];
        const changeAmount = lastDayValue - previousBalance.changeBalance;
        const changePercentage =
          (changeAmount / previousBalance.changeBalance) * 100;
        changes.push({
          ...stats._id,
          changeBalance: changeAmount,
          changePercentage,
        });
      }
    });

    return changes;
  }

  private transformWalletResponse(wallet: WalletDocument): IWalletResponse {
    const { _id: id, name, address } = wallet;

    return {
      id,
      name,
      address,
    };
  }
}
