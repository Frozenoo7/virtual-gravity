import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

import { GenderEnum } from 'commom/enums';

export type UserDocument = UserStructure & Document;

@Schema({ timestamps: true, collection: 'users' })
export class UserStructure {
  @Prop({ required: true, trim: true })
  public name!: string;

  @Prop({ required: true, lowercase: true, trim: true, unique: true })
  public email!: string;

  @Prop({ required: true })
  public password!: string;

  @Prop({ required: true })
  public contact!: string;

  @Prop({ required: true, enum: GenderEnum })
  public gender!: GenderEnum;

  @Prop({ required: true })
  public age!: number;
}

export const UserSchema = SchemaFactory.createForClass(UserStructure);
