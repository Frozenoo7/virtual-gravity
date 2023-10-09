import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';

import { WalletDocument } from './wallet';

export type RecentBalanceDocument = RecentBalanceStructure & Document;

@Schema({ timestamps: true, collection: 'recentBalance' })
export class RecentBalanceStructure {
  @Prop({ required: true })
  public balance!: number;

  @Prop({
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Wallet' }],
    required: true,
  })
  wallet: WalletDocument;
}

export const RecentBalanceSchema = SchemaFactory.createForClass(
  RecentBalanceStructure,
);
