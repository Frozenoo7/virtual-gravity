import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';

import { UserDocument } from './user';

export type WalletDocument = WalletStructure & Document;

@Schema({ timestamps: true, collection: 'wallets' })
export class WalletStructure {
  @Prop({ required: true, trim: true })
  public name!: string;

  @Prop({ required: true, trim: true, unique: true })
  public address!: string;

  @Prop({
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    required: true,
  })
  user: UserDocument;
}

export const WalletSchema = SchemaFactory.createForClass(WalletStructure);
