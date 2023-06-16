import { Prop, Schema, SchemaFactory, raw } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema()
export class User {
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

  @Prop({ required: true, enum: ['user', 'admin', 'employee'], default: 'user' })
  role: string;
  
  @Prop()
  verificationToken: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
