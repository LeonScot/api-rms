import { Module } from '@nestjs/common';
import { SubscriptionController } from './subscription.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Subscription, SubscriptionSchema } from "./subscription.schema";
import { SubscriptionService } from './subscription.service';
import { AttachmentService } from '../attachment/attachment.service';
import { AttachmentModule } from '../attachment/attachment.module';
import { Attachment, AttachmentSchema } from '../attachment/attachment.schema';

@Module({
    imports: [
      MongooseModule.forFeature([{ name: Subscription.name, schema: SubscriptionSchema }]),
      AttachmentModule
    ],
    controllers: [SubscriptionController],
    providers: [SubscriptionService],
    exports: [SubscriptionService]
  })
export class SubscriptionModule {}
