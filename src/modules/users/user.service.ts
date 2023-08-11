// user.model.ts
import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserRoleEnum } from './user.schema';
import { CrudService } from 'src/core/api/crud.service';
import { IPagination } from 'src/core/api/api.interface';

@Injectable()
export class UserService extends CrudService<User> {

    public query: object;

    constructor(@InjectModel(User.name) private readonly userModel: Model<User>) {
        super(userModel);
    }

    async getClients(page?: IPagination) {
        this.query = { role: UserRoleEnum.user};
        return this.findAll(page);
    }

    async getAdmins(page?: IPagination) {
        this.query = { role: UserRoleEnum.admin};
        return this.findAll(page);
    }
    
    async findByEmailnRole(email: string, role: UserRoleEnum): Promise<User> {
        return this.userModel.findOne({ email, role, active: true }).exec();
    }
    
    async findByEmail(email: string): Promise<User> {
        return this.userModel.findOne({ email }).exec();
    }

    async findByVerificationCode(verificationToken: string): Promise<User> {
        return this.userModel.findOne({ verificationToken }).exec();
    }
}
