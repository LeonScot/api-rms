// userSubscription.model.ts
import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { UserSubscription } from './user-subscription.schema';
import { CrudService } from 'src/core/api/crud.service';
import { Subscription } from '../subscription/subscription.schema';
import { User } from '../users/user.schema';

@Injectable()
export class UserSubscriptionService extends CrudService<UserSubscription> {

    public refObjectNames: string[] = [Subscription.name.toLowerCase(), User.name.toLowerCase()];

    constructor(@InjectModel(UserSubscription.name) private readonly userSubscriptionModel: Model<UserSubscription>) {
        super(userSubscriptionModel);
    }

    public getAllActiveUserSubscriptions() {
        this.setQuery({
            active: true,
            expired: false,
            unsubscribed: false,
            $and: [
                { startDate: { $lte: new Date() } },
                { endDate: { $gte: new Date() } },
            ],
        });
        return this.findAll()
    }
}
