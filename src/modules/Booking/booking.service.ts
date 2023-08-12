// servicesOffered.model.ts
import { Model, Types } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Booking } from './booking.schema';
import { CrudService } from 'src/core/api/crud.service';
import { ServicesOffered } from '../ServicesOffered/services-offered.schema';
import { User } from '../users/user.schema';
import { IPagination } from 'src/core/api/api.interface';

@Injectable()
export class BookingService extends CrudService<Booking> {

    public query: object;

    public refObjectNames: string[] = [ServicesOffered.name.toLowerCase(), User.name.toLowerCase()];

    constructor(@InjectModel(Booking.name) private readonly bookingModel: Model<Booking>) {
        super(bookingModel);
    }

    public async isCompleted(_id: string, userId: string | null = null): Promise<boolean | null> {
        const query = userId !== null ? {servicesoffered: _id, user: userId} : {servicesoffered: _id};
        const booking = await this.findOneByQuery(query);
        return booking ? booking.completed : null;
    }

    public async userCompletedServices(page: IPagination, userId: string) {
        this.query = {user: userId, completed: true};
        return this.findAll(page);
    }

    public async userInCompletedServices(page: IPagination, userId: string) {
        this.query = {user: userId, completed: false};
        return this.findAll(page);
    }

    public async allInCompletedServices(page: IPagination) {
        this.query = {completed: false};
        return this.findAll(page, {field: 'createdDate', order: 'desc'});
    }
}
