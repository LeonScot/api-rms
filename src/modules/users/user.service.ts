// user.model.ts
import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './user.schema';
import { CrudService } from 'src/core/api/crud.service';

@Injectable()
export class UserService extends CrudService<User> {

    constructor(@InjectModel(User.name) private readonly userModel: Model<User>) {
        super(userModel);
    }
    
    async findByEmail(email: string): Promise<User> {
        return this.userModel.findOne({ email }).exec();
    }

    async findByVerificationCode(verificationToken: string): Promise<User> {
        return this.userModel.findOne({ verificationToken }).exec();
    }
}
