// servicesOffered.model.ts
import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ServicesOffered } from './services-offered.schema';
import { CrudService } from 'src/core/api/crud.service';
import { SERVICES } from 'src/core/sync-files/services';

@Injectable()
export class ServicesOfferedService extends CrudService<ServicesOffered> {

    public query: object;

    constructor(@InjectModel(ServicesOffered.name) private readonly servicesOfferedModel: Model<ServicesOffered>) {
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
}
