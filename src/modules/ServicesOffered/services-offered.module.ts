import { Module } from '@nestjs/common';
import { ServicesOfferedController } from './services-offered.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { ServicesOffered, ServicesOfferedSchema } from "./services-offered.schema";
import { ServicesOfferedService } from './services-offered.service';
import { AttachmentModule } from '../attachment/attachment.module';

@Module({
    imports: [
      MongooseModule.forFeature([{ name: ServicesOffered.name, schema: ServicesOfferedSchema }]),
      AttachmentModule
    ],
    controllers: [ServicesOfferedController],
    providers: [ServicesOfferedService]
  })
export class ServicesOfferedModule {}
