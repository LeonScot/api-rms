import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';

@Injectable()
export abstract class CrudService<T> {

    public query: object;

    constructor(private readonly model: Model<T>) {}

    async create(rec: T): Promise<T> {
        const createdRec = new this.model(rec);
        return createdRec.save();
    }

    async findAll(page?: {pageNumber: number, limit: number}): Promise<T[]> {
        if (page.pageNumber && page.limit && page.pageNumber > 0 && page.limit > 0) {
            const skip = (page.pageNumber - 1) * page.limit;
            return this.hasQuery ? this.model.find(this.query).skip(skip).limit(page.limit).exec() : this.model.find().skip(skip).limit(page.limit).exec();
        } else {
            return this.hasQuery ? this.model.find(this.query).exec() : this.model.find().exec();
        }
    }

    async count(): Promise<number> {
        return this.hasQuery ? this.model.countDocuments(this.query).exec() : this.model.countDocuments().exec();
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

    private get hasQuery() {
        return this.query ? (Object.keys(this.query).length > 0 ? true : false) : false;
    }
}
