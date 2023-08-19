import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Reward } from '../reward/reward.schema';
import { User } from '../users/user.schema';

export type UserRewardDocument = HydratedDocument<UserReward>;

@Schema()
export class UserReward {
  
  _id?: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: User.name})
  user: User | string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: Reward.name })
  reward: Reward | string;

  @Prop({default: false})
  expired?: boolean;

  @Prop({default: true})
  active?: boolean;

  @Prop({default: false})
  batchCompleted?: boolean;

  @Prop({default: null})
  usedAt?: Date | null;

  @Prop({ type: Date, default: Date.now})
  createdDate?: Date;
  
  @Prop({ type: Date, default: Date.now })
  updatedDate?: Date;
}

export const UserRewardSchema = SchemaFactory.createForClass(UserReward);

UserRewardSchema.pre<UserRewardDocument>('findOneAndUpdate', function (next) {
  this.set({ updatedDate: new Date() });
  next();
});
