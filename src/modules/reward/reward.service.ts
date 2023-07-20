// reward.model.ts
import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Reward } from './reward.schema';
import { CrudService } from 'src/core/api/crud.service';
import { from, lastValueFrom, switchMap } from 'rxjs';
import { AttachmentService } from '../attachment/attachment.service';

@Injectable()
export class RewardService extends CrudService<Reward> {

    public query: object;

    constructor(@InjectModel(Reward.name) private readonly rewardModel: Model<Reward>, private attachmentService: AttachmentService) {
        super(rewardModel);
    }

    public createHasFile(reward: Reward) {
        const reward$ = from(this.create(reward)).pipe(
            switchMap(async res => {
                if (res.image) {
                    const attachment = await this.attachmentService.findByUrl(res.image);
                    attachment.isLinked = true;
                    await this.attachmentService.update(attachment._id, attachment);
                }
                return res;
            })
        );
        return lastValueFrom(reward$);
    }
}
