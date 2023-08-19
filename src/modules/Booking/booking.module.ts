import { Module } from '@nestjs/common';
import { BookingController } from './booking.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Booking, BookingSchema } from "./booking.schema";
import { BookingService } from './booking.service';
import { QrCodeService } from 'src/core/qr-code/qr-code.service';

@Module({
    imports: [
      MongooseModule.forFeature([{ name: Booking.name, schema: BookingSchema }])
    ],
    controllers: [BookingController],
    providers: [BookingService, QrCodeService],
    exports: [BookingService]
  })
export class BookingModule {}
