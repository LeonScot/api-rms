// subscription.model.ts
import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Subscription } from './subscription.schema';
import { CrudService } from 'src/core/api/crud.service';

@Injectable()
export class SubscriptionService extends CrudService<Subscription> {

    public query: object;

    constructor(@InjectModel(Subscription.name) private readonly subscriptionModel: Model<Subscription>) {
        super(subscriptionModel);
    }
}
