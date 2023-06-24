import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

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

  @Prop({required: true})
  subscriptionId: string;
}

export const DiscountCodeTypeSchema = SchemaFactory.createForClass(DiscountCodeType);
