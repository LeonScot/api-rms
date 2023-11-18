// discountCodeType.model.ts
import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { DiscountCodeType } from './discount-code-type.schema';
import { CrudService } from 'src/core/api/crud.service';
import { Subscription } from '../subscription/subscription.schema';

@Injectable()
export class DiscountCodeTypeService extends CrudService<DiscountCodeType> {

    public refObjectNames: string[] = [Subscription.name.toLowerCase()];
    
    public searchFields: string[] = ['name', 'description'];

    constructor(@InjectModel(DiscountCodeType.name) private readonly discountCodeTypeModel: Model<DiscountCodeType>) {
        super(discountCodeTypeModel);
    }
}
