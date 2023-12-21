import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type ServicesOfferedDocument = HydratedDocument<ServicesOffered>;

@Schema()
export class ServicesOffered {
  
  _id?: string;

  @Prop({ required: true })
  intakeId: string;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true})
  duration: number;
  
  @Prop({ required: true})
  price: number;
  
  @Prop({ required: false, default: null})
  externalServiceId: string;

  // @Prop({ required: true})
  // description: string;
  
  // @Prop({ required: false})
  // cancellationHoursLimit: number;
  
  // @Prop({ required: false})
  // cancellationFee: number;
  
  // @Prop({ required: false})
  // availabilityStart: number;
  
  // @Prop({ required: false})
  // availabilityEnd: number;
  
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

interface IntakeService {
  Id: string;
  Name: string;
  Price: number;
  Duration: number;
  ExternalServiceId: string | null;
}

export interface IntakeQData {
  Locations: Array<{
    Id: string,
    Name: string,
    Address: string
  }>,
  Services: Array<IntakeService>,
  Practitioners: Array<{
    Id: string,
    CompleteName: string,
    FirstName: string,
    LastName: string,
    Email: string
  }>,
}

export const IntakeQDataParser = (intakeData: IntakeService): ServicesOffered => ({
  intakeId: intakeData.Id,
  name: intakeData.Name,
  price: intakeData.Price,
  duration: intakeData.Duration,
  externalServiceId: intakeData.ExternalServiceId,
});