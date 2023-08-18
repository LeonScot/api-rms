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

    public refObjectNames: string[] = [ServicesOffered.name.toLowerCase(), User.name.toLowerCase()];

    constructor(@InjectModel(Booking.name) private readonly bookingModel: Model<Booking>) {
        super(bookingModel);
    }

    public async isCompleted(_id: string, userId: string | null = null): Promise<boolean | null> {
        const query = userId !== null ? {servicesoffered: _id, user: userId} : {servicesoffered: _id};
        const booking = await this.findOneByQuery(query);
        return booking ? booking.completed : null;
    }

    public async userCompletedServices(page: IPagination | null, userId: string) {
        const query = {user: userId, completed: true, countForRewards: true};
        return await this.findAllDirectQuery(query, page);
    }

    public async resetCountForRewards(userId: string) {
        const query = {user: userId, completed: true, countForRewards: true};
        return await this.updateManyByQuery(query, {countForRewards: false});
    }

    public async userInCompletedServices(page: IPagination, userId: string) {
        this.setQuery({user: userId, completed: false});
        return this.findAll(page);
    }

    public async allInCompletedServices(page: IPagination) {
        this.setQuery({completed: false});
        return this.findAll(page, {field: 'createdDate', order: 'desc'});
    }
    public async pastBookedServices(page: IPagination) {
        this.setQuery({completed: true});
        return this.findAll(page, {field: 'createdDate', order: 'desc'});
    }

    public async verifyBooking(qrCode: string) {
        const query = {qrCode};
        const booking = await this.findOneByQuery(query);
        if (booking.completed === true) {
            return null;
        } else {
            booking.scanned = booking.scanned + 1;
            await this.update(booking._id, booking);
            return booking;
        }
    }

    public async markAsComplete(id: string) {
        const booking = await this.findById(id);
        booking.completed = true;
        await this.update(booking._id, booking);
        return booking;
    }
}
