// servicesOffered.model.ts
import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ServicesOffered } from './services-offered.schema';
import { CrudService } from 'src/core/api/crud.service';
import { SERVICES } from 'src/core/sync-files/services';
import { UserRoleEnum } from '../users/user.schema';
import { IPagination } from 'src/core/api/api.interface';
import { BookingService } from '../Booking/booking.service';
import { UserSessionInfo } from 'src/core/auth/jwt.model';

@Injectable()
export class ServicesOfferedService extends CrudService<ServicesOffered> {

    constructor(@InjectModel(ServicesOffered.name) private readonly servicesOfferedModel: Model<ServicesOffered>, private bookingService: BookingService) {
        super(servicesOfferedModel);
    }

    public async syncServices() {
        const services = SERVICES;
        const sod: Array<ServicesOffered> = [];
        services.forEach(async (so) => {
            const service = await this.create({
                serviceId: so.Id,
                name: so.Name,
                description: so.Description,
                duration: so.Duration,
                price: so.Price,
                cancellationHoursLimit: so.CancellationHoursLimit,
                cancellationFee: so.CancellationFee,
                availabilityStart: so.AvailabilityStart,
                availabilityEnd: so.AvailabilityEnd,
            });
            sod.push(service);
        });

        return sod;
    }

    public async findAllConditonal(page: IPagination, user: UserSessionInfo) {
        if (user.role === UserRoleEnum.user) {
            this.setQuery({active: true});
            const userBookedServices = await this.bookingService.userInCompletedServices({pageNumber: 0, limit: 0}, user.sub);
            this.setExcludedQuery({'_id': userBookedServices.data.map(d => d.servicesoffered)}) 
        }
        return await this.findAll(page);
    }
}
