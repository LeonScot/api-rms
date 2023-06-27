import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, HydratedDocument, SchemaTypes } from 'mongoose';

export type RevokedTokenDocument = HydratedDocument<RevokedToken>;

@Schema()
export class RevokedToken {
    
  _id?: string;
  
  @Prop({ required: true, unique: true })
  token: string;

  @Prop({ default: false })
  revokedStatus?: boolean;

  @Prop({ type: Date, default: Date.now})
  createdDate?: Date;
  
  @Prop({ type: Date })
  updatedDate?: Date;
}

export const RevokedTokenSchema = SchemaFactory.createForClass(RevokedToken);

RevokedTokenSchema.pre<RevokedTokenDocument>('findOneAndUpdate', function (next) {
  this.set({ updatedDate: Date.now });
  next();
});