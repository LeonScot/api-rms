import { Module } from '@nestjs/common';
import { CampaignController } from './campaign.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Campaign, CampaignSchema } from "./campaign.schema";
import { CampaignService } from './campaign.service';
import { AttachmentModule } from '../attachment/attachment.module';

@Module({
    imports: [
      MongooseModule.forFeature([{ name: Campaign.name, schema: CampaignSchema }]),
      AttachmentModule
    ],
    controllers: [CampaignController],
    providers: [CampaignService]
  })
export class CampaignModule {}
