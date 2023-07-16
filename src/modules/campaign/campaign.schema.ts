import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type CampaignDocument = HydratedDocument<Campaign>;

@Schema()
export class Campaign {
  
  _id: string;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true})
  description: string;

  @Prop({ required: true})
  image: string;

  @Prop({ default: true})
  active: boolean;

  @Prop({ default: false})
  expired: boolean;

  @Prop({ required: true, type: Date})
  startDate: Date;

  @Prop({ required: true, type: Date})
  endDate: Date;

  @Prop({ type: Date, default: Date.now})
  createdDate: Date;
  
  @Prop({ type: Date, default: Date.now })
  updatedDate: Date;
}

export const CampaignSchema = SchemaFactory.createForClass(Campaign);

CampaignSchema.pre<CampaignDocument>('findOneAndUpdate', function (next) {
  this.set({ updatedDate: new Date() });
  next();
});
