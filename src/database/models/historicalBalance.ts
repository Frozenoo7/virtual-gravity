import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';

import { WalletDocument } from './wallet';

export type HistoricalBalanceDocument = HistoricalBalanceStructure & Document;

@Schema({ timestamps: true, collection: 'historicalBalance' })
export class HistoricalBalanceStructure {
  @Prop({ required: true })
  public balance!: number;

  @Prop({
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Wallet' }],
    required: true,
  })
  wallet: WalletDocument;
}

export const HistoricalBalanceSchema = SchemaFactory.createForClass(
  HistoricalBalanceStructure,
);
