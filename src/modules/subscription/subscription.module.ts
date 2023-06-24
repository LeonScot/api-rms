import { Module } from '@nestjs/common';
import { SubscriptionController } from './subscription.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Subscription, SubscriptionSchema } from "./subscription.schema";
import { SubscriptionService } from './subscription.service';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: Subscription.name, schema: SubscriptionSchema }]),
    ],
    controllers: [SubscriptionController],
    providers: [SubscriptionService],
  })
export class SubscriptionModule {}