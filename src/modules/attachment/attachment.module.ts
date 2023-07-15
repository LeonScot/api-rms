import { Module } from '@nestjs/common';
import { AttachmentController } from './attachment.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Attachment, AttachmentSchema } from "./attachment.schema";
import { AttachmentService } from './attachment.service';
import FirebaseAdmin from 'src/core/firebase-admin/firebase-admin';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: Attachment.name, schema: AttachmentSchema }]),
    ],
    controllers: [AttachmentController],
    providers: [
      AttachmentService,
      {
        provide: 'FirebaseAdmin',
        useValue: FirebaseAdmin, // Provide the Firebase Admin SDK instance
      },
    ],
  })
export class AttachmentModule {}
