// servicesOffered.model.ts
import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { IntakeQData, IntakeQDataParser, ServicesOffered } from './services-offered.schema';
import { CrudService } from 'src/core/api/crud.service';
import { SERVICES } from 'src/core/sync-files/services';
import { UserRoleEnum } from '../users/user.schema';
import { IPagination } from 'src/core/api/api.interface';
import { BookingService } from '../Booking/booking.service';
import { UserSessionInfo } from 'src/core/auth/jwt.model';
import { HttpService } from '@nestjs/axios';
import { AxiosHeaders } from 'axios';
import { ConfigService } from '@nestjs/config';
import { EnvironmentVariables } from 'src/core/config/configuration';

@Injectable()
export class ServicesOfferedService extends CrudService<ServicesOffered> {

    public searchFields: string[] = ['name', 'description'];

    constructor(
        @InjectModel(ServicesOffered.name) private readonly servicesOfferedModel: Model<ServicesOffered>,
        private bookingService: BookingService,
        private readonly httpService: HttpService,
        private configService: ConfigService<EnvironmentVariables>
    ) {
        super(servicesOfferedModel);
    }

    public async syncServices() {
        try {
            const headers = new AxiosHeaders().set('X-Auth-Key', this.configService.get('X_AUTH_KEY'));
            this.httpService.get<IntakeQData>(this.configService.get('INTAKE_SERVICE_API'), {headers}).subscribe({
                next: response => {
                    console.log('response', response);
                    response.data.Services.forEach(async service => {
                        const find = await this.findOneByQuery({intakeId: service.Id});
                        if (find) {
                            this.update(find._id, IntakeQDataParser(service))
                        } else {
                            this.create(IntakeQDataParser(service));
                        }
                    });
                }
            });
            return true;
        } catch (error) {
            return false;
        }
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
