// user.model.ts
import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserRoleEnum } from './user.schema';
import { CrudService } from 'src/core/api/crud.service';

@Injectable()
export class UserService extends CrudService<User> {

    public query: object;

    constructor(@InjectModel(User.name) private readonly userModel: Model<User>) {
        super(userModel);
    }

    async getClients(page?: {pageNumber: number, limit: number}) {
        this.query = { role: UserRoleEnum.user};
        return this.findAll(page);
    }

    async getAdmins(page?: {pageNumber: number, limit: number}) {
        this.query = { role: UserRoleEnum.admin};
        return this.findAll(page);
    }
    
    async findByEmail(email: string): Promise<User> {
        return this.userModel.findOne({ email }).exec();
    }

    async findByVerificationCode(verificationToken: string): Promise<User> {
        return this.userModel.findOne({ verificationToken }).exec();
    }
}
