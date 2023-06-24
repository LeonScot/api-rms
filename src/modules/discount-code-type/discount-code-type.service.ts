// discountCodeType.model.ts
import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { DiscountCodeType } from './discount-code-type.schema';
import { CrudService } from 'src/core/api/crud.service';

@Injectable()
export class DiscountCodeTypeService extends CrudService<DiscountCodeType> {

    public query: object;

    constructor(@InjectModel(DiscountCodeType.name) private readonly discountCodeTypeModel: Model<DiscountCodeType>) {
        super(discountCodeTypeModel);
    }
}
