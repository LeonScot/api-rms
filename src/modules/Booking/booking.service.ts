// servicesOffered.model.ts
import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Booking } from './booking.schema';
import { CrudService } from 'src/core/api/crud.service';

@Injectable()
export class BookingService extends CrudService<Booking> {

    public query: object;

    constructor(@InjectModel(Booking.name) private readonly bookingModel: Model<Booking>) {
        super(bookingModel);
    }
}
