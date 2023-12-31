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

  @Prop({ required: true, unique: true   })
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
  role: UserRoleEnum;
  
  @Prop({ default: null })
  verificationToken: string | null;

  @Prop({ default: null })
  resetPasswordToken: string | null;
  
  @Prop({ default: true })
  active: boolean;
  
  @Prop({ default: true })
  twoFA: boolean;

  @Prop({ required: false, default: null })
  backGroundColor: string | null;

  @Prop({ required: false, default: null})
  image: string | null;

  @Prop({ type: Date, default: Date.now})
  createdDate: Date;
  
  @Prop({ type: Date })
  updatedDate: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.pre<UserDocument>('findOneAndUpdate', function (next) {
  this.set({ updatedDate: new Date() });
  next();
});