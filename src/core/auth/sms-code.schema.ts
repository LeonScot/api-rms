import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document, HydratedDocument, SchemaTypes } from 'mongoose';
import { User, UserRoleEnum } from 'src/modules/users/user.schema';

export type SmsCodeDocument = HydratedDocument<SmsCode>;

@Schema()
export class SmsCode {
    
  _id?: string;
  
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: User.name})
  user: User | string;

  @Prop({ required: true })
  code: string;

  @Prop({ default: false })
  verified?: boolean;

  @Prop({ type: Date, default: Date.now})
  createdDate?: Date;
  
  @Prop({ type: Date })
  updatedDate?: Date;
}

export const SmsCodeSchema = SchemaFactory.createForClass(SmsCode);

SmsCodeSchema.pre<SmsCodeDocument>('findOneAndUpdate', function (next) {
  this.set({ updatedDate: new Date() });
  next();
});
