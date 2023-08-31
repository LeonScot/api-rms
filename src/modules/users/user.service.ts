// user.model.ts
import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserRoleEnum } from './user.schema';
import { CrudService } from 'src/core/api/crud.service';
import { IPagination } from 'src/core/api/api.interface';

@Injectable()
export class UserService extends CrudService<User> {

    constructor(@InjectModel(User.name) private readonly userModel: Model<User>) {
        super(userModel);
    }

    async getClients(page?: IPagination) {
        this.setQuery({ role: UserRoleEnum.user});
        return this.findAll(page);
    }

    async getAllActiveClients(page?: IPagination) {
        this.setQuery({ role: UserRoleEnum.user, active: true });
        return this.findAll(page);
    }

    async getAdmins(page?: IPagination) {
        this.setQuery({ role: UserRoleEnum.admin});
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

    async isPhoneNumberUnique(phoneNumber: string) {
        const query = {phoneNumber};
        const user = await this.findOneByQuery(query);
        return user && user.phoneNumber === phoneNumber ? false : true;
    }

    async twoFaEnable(userId: string) {
        const user = await this.findById(userId);
        user.twoFA = true;
        await this.update(user._id, user);
        return;
    }

    async twoFaDisable(userId: string) {
        const user = await this.findById(userId);
        user.twoFA = false;
        await this.update(user._id, user);
        return;
    }

    async getUser2Fa(userId: string) {
        const user = await this.findById(userId);
        return user.twoFA;
    }
}
