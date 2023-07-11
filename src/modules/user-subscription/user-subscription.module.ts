import { Module } from '@nestjs/common';
import { UserSubscriptionController } from './user-subscription.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSubscription, UserSubscriptionSchema } from "./user-subscription.schema";
import { UserSubscriptionService } from './user-subscription.service';
import { Subscription, SubscriptionSchema } from '../subscription/subscription.schema';
import { SubscriptionService } from '../subscription/subscription.service';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: UserSubscription.name, schema: UserSubscriptionSchema }]),
        MongooseModule.forFeature([{ name: Subscription.name, schema: SubscriptionSchema }])
    ],
    controllers: [UserSubscriptionController],
    providers: [UserSubscriptionService, SubscriptionService],
  })
export class UserSubscriptionModule {}
