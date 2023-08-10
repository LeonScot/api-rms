import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type BookingDocument = HydratedDocument<Booking>;

@Schema()
export class Booking {
  
  _id?: string;

  @Prop({ required: true })
  serviceId: string;

  @Prop({ required: true })
  userId: string;
  
  @Prop({ required: true, unique: true })
  qrCode: string;
  
  @Prop({ required: true, default: 0 })
  scanned?: number;
  
  @Prop({ required: true, default: false })
  completed?: boolean;

  @Prop({ required: true, default: true})
  active?: boolean;

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
