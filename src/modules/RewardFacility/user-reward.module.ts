import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserReward, UserRewardSchema } from './user-reward.schema';
import { UserRewardService } from './user-reward.service';
import { UserRewardController } from './user-reward.controller';
import { RewardService } from '../reward/reward.service';
import { BookingService } from '../Booking/booking.service';
import { UserService } from '../users/user.service';
import { RewardModule } from '../reward/reward.module';
import { BookingModule } from '../Booking/booking.module';
import { UserModule } from '../users/user.module';
import { UserSubscriptionModule } from '../user-subscription/user-subscription.module';
import { UserSubscriptionService } from '../user-subscription/user-subscription.service';
import { MailModule } from 'src/core/email/mail.module';

@Module({
    imports: [
      MongooseModule.forFeature([{ name: UserReward.name, schema: UserRewardSchema }]),
      RewardModule,
      BookingModule,
      UserModule,
      UserSubscriptionModule,
      MailModule
    ],
    controllers: [UserRewardController],
    providers: [UserRewardService]
  })
export class UserRewardModule {}
