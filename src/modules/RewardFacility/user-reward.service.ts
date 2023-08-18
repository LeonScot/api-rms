// reward.model.ts
import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CrudService } from 'src/core/api/crud.service';
import { UserReward } from './user-reward.schema';
import { RewardService } from '../reward/reward.service';
import { BookingService } from '../Booking/booking.service';
import { UserService } from '../users/user.service';
import { Reward } from '../reward/reward.schema';
import { User } from '../users/user.schema';

@Injectable()
export class UserRewardService extends CrudService<UserReward> {

    public refObjectNames: string[] = [User.name.toLowerCase(), Reward.name.toLowerCase()];

    constructor(
        @InjectModel(UserReward.name) private readonly rewardModel: Model<UserReward>,
        private rewardService: RewardService,
        private bookingService: BookingService,
        private userService: UserService
    ) {
        super(rewardModel);
    }

    public getLastUserReward(userId: string) {
        return this.findOneByQuery({user: userId, active: true, expired: false, batchCompleted: false, usedAt: null}, {field: 'createdDate', order: 'desc'});
    }

    public async cronToAssignUserReward() {
        const highestReward = await this.rewardService.getHighestVisitReward();
        const users = (await this.userService.getAllActiveClients()).data;
        
        users.forEach(async user => {
            
            const userCompletedServices = await this.bookingService.userCompletedServices(null, user._id);

            const awardedReward = await this.rewardService.getLatestRewardByCount(userCompletedServices.totalCount);
            
            const lastReward = await this.getLastUserReward(user._id);
            
            if (awardedReward !== null && awardedReward._id.toString() !== lastReward.reward['_id'].toString()) {
                await this.create({
                    user: user._id,
                    reward: awardedReward._id,
                });
                if (highestReward._id.toString() === awardedReward._id.toString() ) {
                    await this.bookingService.resetCountForRewards(user._id);
                }
            }
            
        });
    }
}