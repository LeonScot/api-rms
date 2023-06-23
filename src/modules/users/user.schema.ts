import { Prop, Schema, SchemaFactory, raw } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

export enum UserRoleEnum {
  user = 'user',
  admin = 'admin',
  employee = 'employee'
}

@Schema()
export class User {
  
  _id: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  phoneNumber: string;

  @Prop({ required: true })
  gender: string;

  @Prop({ required: true })
  country: string;

  @Prop(raw({
    street: { type: String },
    city: { type: String },
    state: { type: String },
    zipcode: { type: String }
  }))
  address: Record<string, any>;

  @Prop({ default: false })
  verified: boolean;

  @Prop({ required: true, enum: [UserRoleEnum.user, UserRoleEnum.admin, UserRoleEnum.employee], default: UserRoleEnum.user })
  role: string;
  
  @Prop()
  verificationToken: string;

  @Prop()
  resetPasswordToken: string;
  
  @Prop({ default: true })
  active: boolean;
}

export const UserSchema = SchemaFactory.createForClass(User);
