import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { ValueTypeEnum } from '../discount-code-type/discount-code-type.schema';

export enum RewardTypeEnum {
  retention = 'retention',
  visit = 'visit'
}

export enum ServiceOrProduct {
  service = 'service',
  product = 'product'
}

export type RewardDocument = HydratedDocument<Reward>;

@Schema()
export class Reward {
  
  _id: string;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true})
  description: string;

  @Prop({ required: false})
  image: string;

  @Prop({ default: true})
  active: boolean;

  @Prop({ required: true})
  durationInMonth: number;
  
  @Prop({ required: true})
  value: number;
  
  @Prop({ required: true, enum: [ValueTypeEnum.percentage, ValueTypeEnum.flat, ValueTypeEnum.creditReceived, ValueTypeEnum.bankCredit]})
  valueType: ValueTypeEnum;
  
  @Prop({ required: false})
  capAmount: number;
  
  @Prop({ required: false})
  minAmount: number;
  
  @Prop({ required: true, enum: [RewardTypeEnum.retention, RewardTypeEnum.visit]})
  rewardType: RewardTypeEnum;

  @Prop({ required: true})
  count: number;

  @Prop({ required: true, enum: [ServiceOrProduct.product, ServiceOrProduct.service]})
  serviceOrProduct: ServiceOrProduct;

  @Prop({ required: true})
  serviceOrProductId: string;

  @Prop({ type: Date, default: Date.now})
  createdDate: Date;
  
  @Prop({ type: Date, default: Date.now })
  updatedDate: Date;
}

export const RewardSchema = SchemaFactory.createForClass(Reward);

RewardSchema.pre<RewardDocument>('findOneAndUpdate', function (next) {
  this.set({ updatedDate: new Date() });
  next();
});
