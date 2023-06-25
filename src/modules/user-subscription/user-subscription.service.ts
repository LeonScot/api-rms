// userSubscription.model.ts
import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { UserSubscription } from './user-subscription.schema';
import { CrudService } from 'src/core/api/crud.service';
import { Subscription } from '../subscription/subscription.schema';

@Injectable()
export class UserSubscriptionService extends CrudService<UserSubscription> {

    public refObjectNames: string[] = [Subscription.name.toLowerCase()];

    constructor(@InjectModel(UserSubscription.name) private readonly userSubscriptionModel: Model<UserSubscription>) {
        super(userSubscriptionModel);
    }
}
