import { Module } from '@nestjs/common';
import { UserSubscriptionController } from './user-subscription.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSubscription, UserSubscriptionSchema } from "./user-subscription.schema";
import { UserSubscriptionService } from './user-subscription.service';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: UserSubscription.name, schema: UserSubscriptionSchema }]),
    ],
    controllers: [UserSubscriptionController],
    providers: [UserSubscriptionService],
  })
export class UserSubscriptionModule {}
