// campaign.model.ts
import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Campaign } from './campaign.schema';
import { CrudService } from 'src/core/api/crud.service';
import { from, lastValueFrom, switchMap } from 'rxjs';
import { AttachmentService } from '../attachment/attachment.service';

@Injectable()
export class CampaignService extends CrudService<Campaign> {

    constructor(@InjectModel(Campaign.name) private readonly campaignModel: Model<Campaign>, private attachmentService: AttachmentService) {
        super(campaignModel);
    }

    public createHasFile(campaign: Campaign) {
        const campaign$ = from(this.create(campaign)).pipe(
            switchMap(async res => {
                if (res.image) {
                    const attachment = await this.attachmentService.findByUrl(res.image);
                    attachment.isLinked = true;
                    await this.attachmentService.update(attachment._id, attachment);
                }
                return res;
            })
        );
        return lastValueFrom(campaign$);
    }
}
