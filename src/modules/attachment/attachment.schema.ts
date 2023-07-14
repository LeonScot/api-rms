import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type AttachmentDocument = HydratedDocument<Attachment>;

@Schema()
export class Attachment {
  
  _id?: string;

  @Prop({ required: true, unique: true})
  name: string;

  @Prop({ required: true})
  type: string;

  @Prop({ required: true, unique: true})
  url: string;

  @Prop({ default: false})
  isLinked?: boolean;

  @Prop({ type: Date, default: Date.now})
  createdDate?: Date;
  
  @Prop({ type: Date, default: Date.now })
  updatedDate?: Date;
}

export const AttachmentSchema = SchemaFactory.createForClass(Attachment);

AttachmentSchema.pre<AttachmentDocument>('findOneAndUpdate', function (next) {
  this.set({ updatedDate: new Date() });
  next();
});
