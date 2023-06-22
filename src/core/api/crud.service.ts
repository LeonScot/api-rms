import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export abstract class CrudService<T> {

    constructor(private readonly model: Model<T>) {}

    async create(rec: T): Promise<T> {
        const createdRec = new this.model(rec);
        return createdRec.save();
    }

    async findAll(): Promise<T[]> {
        return this.model.find().exec();
    }

    async findById(id: string): Promise<T> {
        return this.model.findById(id).exec();
    }

    async update(id: string, rec: T): Promise<T> {
        return this.model.findByIdAndUpdate(id, rec, { new: true }).exec();
    }

    async delete(id: string): Promise<T> {
        return this.model.findByIdAndRemove(id).exec();
    }
}
