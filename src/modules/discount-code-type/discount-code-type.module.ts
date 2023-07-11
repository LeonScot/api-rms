import { Module } from '@nestjs/common';
import { DiscountCodeTypeController } from './discount-code-type.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { DiscountCodeType, DiscountCodeTypeSchema } from "./discount-code-type.schema";
import { DiscountCodeTypeService } from './discount-code-type.service';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: DiscountCodeType.name, schema: DiscountCodeTypeSchema }]),
    ],
    controllers: [DiscountCodeTypeController],
    providers: [DiscountCodeTypeService],
  })
export class DiscountCodeTypeModule {}
