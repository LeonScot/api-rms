import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { ValueTypeEnum } from '../discount-code-type/discount-code-type.schema';

export enum ServicesOfferedTypeEnum {
  retention = 'retention',
  visit = 'visit'
}

export enum ServiceOrProduct {
  service = 'service',
  product = 'product'
}

export type ServicesOfferedDocument = HydratedDocument<ServicesOffered>;

@Schema()
export class ServicesOffered {
  
  _id?: string;

  @Prop({ required: true, unique: true })
  serviceId: string;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true})
  description: string;

  @Prop({ required: true})
  duration: number;
  
  @Prop({ required: true})
  price: number;
  
  @Prop({ required: false})
  cancellationHoursLimit: number;
  
  @Prop({ required: false})
  cancellationFee: number;
  
  @Prop({ required: false})
  availabilityStart: number;
  
  @Prop({ required: false})
  availabilityEnd: number;
  
  @Prop({ required: true, default: true})
  active?: boolean;

  @Prop({ type: Date, default: Date.now})
  createdDate?: Date;
  
  @Prop({ type: Date, default: Date.now })
  updatedDate?: Date;
}

export const ServicesOfferedSchema = SchemaFactory.createForClass(ServicesOffered);

ServicesOfferedSchema.pre<ServicesOfferedDocument>('findOneAndUpdate', function (next) {
  this.set({ updatedDate: new Date() });
  next();
});
