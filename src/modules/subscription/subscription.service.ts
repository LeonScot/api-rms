// subscription.model.ts
import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Subscription } from './subscription.schema';
import { CrudService } from 'src/core/api/crud.service';
import { from, lastValueFrom, of, pipe, switchMap } from 'rxjs';
import { AttachmentService } from '../attachment/attachment.service';

@Injectable()
export class SubscriptionService extends CrudService<Subscription> {

    public searchFields: string[] = ['name', 'description'];

    constructor(@InjectModel(Subscription.name) private readonly subscriptionModel: Model<Subscription>, private attachmentService: AttachmentService) {
        super(subscriptionModel);
    }

    public createHasFile(subscription: Subscription) {
        const subscription$ = from(this.create(subscription)).pipe(
            switchMap(async res => {
                const attachment = await this.attachmentService.findByUrl(res.image);
                attachment.isLinked = true;
                this.attachmentService.update(attachment._id, attachment);
                return res;
            })
        );
        return lastValueFrom(subscription$);
    }
}
