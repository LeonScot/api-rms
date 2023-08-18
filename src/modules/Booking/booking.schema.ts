import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, {  HydratedDocument } from 'mongoose';
import { ServicesOffered } from '../ServicesOffered/services-offered.schema';
import { User } from '../users/user.schema';

export type BookingDocument = HydratedDocument<Booking>;

@Schema()
export class Booking {
  
  _id?: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: ServicesOffered.name })
  servicesoffered: ServicesOffered | string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: User.name })
  user: User | string;
  
  @Prop({ required: true, unique: true })
  qrCode: string;
  
  @Prop({ required: true, default: 0 })
  scanned?: number;
  
  @Prop({ required: true, default: false })
  completed?: boolean;

  @Prop({ required: true, default: true})
  active?: boolean;

  @Prop({ required: true, default: true})
  countForRewards?: boolean;

  @Prop({ type: Date, default: Date.now})
  createdDate?: Date;
  
  @Prop({ type: Date, default: Date.now })
  updatedDate?: Date;
}

export const BookingSchema = SchemaFactory.createForClass(Booking);

BookingSchema.pre<BookingDocument>('findOneAndUpdate', function (next) {
  this.set({ updatedDate: new Date() });
  next();
});
