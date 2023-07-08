import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Subscription } from '../subscription/subscription.schema';

export type DiscountCodeTypeDocument = HydratedDocument<DiscountCodeType>;

export enum DiscountValueTypeEnum {
  percentage = 'percentage',
  flat = 'flat',
  creditReceived = 'creditReceived',
  bankCredit = 'bankCredit'
}

@Schema()
export class DiscountCodeType {
  
  _id: string;

  @Prop({ required: true, unique: true })
  name: string;
  
  @Prop({ required: true})
  description: string;

  @Prop({ required: true})
  value: number;
  
  @Prop({ required: true, enum: [DiscountValueTypeEnum.percentage, DiscountValueTypeEnum.flat, DiscountValueTypeEnum.creditReceived, DiscountValueTypeEnum.bankCredit]})
  valueType: string;
  
  @Prop({ required: false})
  capAmount: number;
  
  @Prop({ default: true})
  active: boolean;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: Subscription.name })
  subscription: Subscription;

  @Prop({ type: Date, default: Date.now})
  createdDate: Date;
  
  @Prop({ type: Date })
  updatedDate: Date;
}
export const DiscountCodeTypeSchema = SchemaFactory.createForClass(DiscountCodeType);

DiscountCodeTypeSchema.pre<DiscountCodeTypeDocument>('findOneAndUpdate', function (next) {
  this.set({ updatedDate: new Date() });
  next();
});


