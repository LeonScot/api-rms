import { Module } from '@nestjs/common';
import { RewardController } from './reward.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Reward, RewardSchema } from "./reward.schema";
import { RewardService } from './reward.service';
import { AttachmentModule } from '../attachment/attachment.module';

@Module({
    imports: [
      MongooseModule.forFeature([{ name: Reward.name, schema: RewardSchema }]),
      AttachmentModule
    ],
    controllers: [RewardController],
    providers: [RewardService],
    exports: [RewardService]
  })
export class RewardModule {}
