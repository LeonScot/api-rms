import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, HydratedDocument, SchemaTypes } from 'mongoose';

export type UserDocument = HydratedDocument<RevokedToken>;

@Schema()
export class RevokedToken {
    
  _id?: string;
  
  @Prop({ required: true, unique: true })
  token: string;

  @Prop({ default: false })
  revokedStatus?: boolean;
}

export const RevokedTokenSchema = SchemaFactory.createForClass(RevokedToken);
