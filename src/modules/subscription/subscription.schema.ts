import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type SubscriptionDocument = HydratedDocument<Subscription>;

@Schema()
export class Subscription {
  
  _id: string;

  @Prop({ required: true, unique: true })
  name: string;

  @Prop({ required: true})
  description: string;

  @Prop({ required: true})
  amount: number;

  @Prop({ required: true})
  tenure: number;

  @Prop({ default: true})
  active: boolean;
}

export const SubscriptionSchema = SchemaFactory.createForClass(Subscription);
