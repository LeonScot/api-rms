import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, HydratedDocument, SchemaTypes } from 'mongoose';
import { UserRoleEnum } from 'src/modules/users/user.schema';

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
  this.set({ updatedDate: new Date() });
  next();
});

export interface TokenPayload {
  sub: string;
  username: string;
  role: UserRoleEnum;
  iat?: number;
  ext?: number;
}