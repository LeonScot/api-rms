import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Date, HydratedDocument } from 'mongoose';
import { Subscription } from '../subscription/subscription.schema';
import { User } from '../users/user.schema';

export type UserSubscriptionDocument = HydratedDocument<UserSubscription>;

@Schema()
export class UserSubscription {
  
  _id: string;

  @Prop({ required: true, unique: true })
  uniqueCode: string;
  
  @Prop({ required: true, type: Date})
  startDate: Date;

  @Prop({ required: true, type: Date})
  endDate: Date;
  
  @Prop({ default: false})
  autoRenew: boolean;

  @Prop({ default: false})
  expired: boolean;
  
  @Prop({ default: true})
  active: boolean;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: User.name })
  user: User;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: Subscription.name })
  subscription: Subscription;

  @Prop({ type: Date, default: Date.now})
  createdDate: Date;
  
  @Prop({ type: Date })
  updatedDate: Date;
}

export const UserSubscriptionSchema = SchemaFactory.createForClass(UserSubscription);

UserSubscriptionSchema.pre<UserSubscriptionDocument>('findOneAndUpdate', function (next) {
  this.set({ updatedDate: new Date() });
  next();
});