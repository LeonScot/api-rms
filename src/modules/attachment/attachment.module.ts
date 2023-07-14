import { Module } from '@nestjs/common';
import { AttachmentController } from './attachment.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Attachment, AttachmentSchema } from "./attachment.schema";
import { AttachmentService } from './attachment.service';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: Attachment.name, schema: AttachmentSchema }]),
    ],
    controllers: [AttachmentController],
    providers: [AttachmentService],
  })
export class AttachmentModule {}
