// reward.model.ts
import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Reward, RewardTypeEnum } from './reward.schema';
import { CrudService } from 'src/core/api/crud.service';
import { from, lastValueFrom, switchMap } from 'rxjs';
import { AttachmentService } from '../attachment/attachment.service';
import { IPagination, ISort } from 'src/core/api/api.interface';
import { UserRoleEnum } from '../users/user.schema';

@Injectable()
export class RewardService extends CrudService<Reward> {

    public searchFields: string[] = ['name', 'description'];

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

    public findAllVisitRewards(page: IPagination, userRole: UserRoleEnum){
        const query = userRole === UserRoleEnum.admin ? { rewardType: RewardTypeEnum.visit } : { rewardType: RewardTypeEnum.visit, active: true };
        this.setQuery(query);
        return this.findAll(page, {field: 'count', order: 'asc'});
    }

    public getAllActive() {
        this.setQuery({ rewardType: RewardTypeEnum.visit, active: true });
        return this.findAll(null, {field: 'count', order: 'asc'});
    }

    public getLatestRewardByCount(count: number) {
        const query = { rewardType: RewardTypeEnum.visit, active: true, count: { $lte: count } };
        const sort: ISort = {field: 'count', order: 'desc'};
        return this.findOneByQuery(query, sort);
    }

    public getHighestVisitReward() {
        const query = { rewardType: RewardTypeEnum.visit, active: true };
        const sort: ISort = {field: 'count', order: 'desc'};
        return this.findOneByQuery(query, sort);
    }
}
