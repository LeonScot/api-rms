// user.model.ts
import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './user.schema';

@Injectable()
export class UserService {

    constructor(@InjectModel(User.name) private readonly userModel: Model<User>) {}

    async create(user: User): Promise<User> {
        const createdUser = new this.userModel(user);
        return createdUser.save();
    }

    async findAll(): Promise<User[]> {
        return this.userModel.find().exec();
    }

    async findById(id: string): Promise<User> {
        return this.userModel.findById(id).exec();
    }
    
    async findByEmail(email: string): Promise<User> {
        return this.userModel.findOne({ email }).exec();
    }

    async findByVerificationCode(verificationToken: string): Promise<User> {
        return this.userModel.findOne({ verificationToken }).exec();
    }

    async update(id: string, user: User): Promise<User> {
        return this.userModel.findByIdAndUpdate(id, user, { new: true }).exec();
    }

    async delete(id: string): Promise<User> {
        return this.userModel.findByIdAndRemove(id).exec();
    }
}
