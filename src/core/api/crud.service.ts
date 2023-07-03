import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';

@Injectable()
export abstract class CrudService<T> {

    public query: object = {};

    public refObjectNames: string[] = [];

    constructor(private readonly model: Model<T>) {}

    async create(rec: T): Promise<T> {
        const createdRec = new this.model(rec);
        return createdRec.save();
    }

    async findAll(page?: {pageNumber: number, limit: number}): Promise<{data: T[], totalCount: number}> {
        if (page && page.pageNumber && page.limit && page.pageNumber > 0 && page.limit > 0) {
            const skip = (page.pageNumber - 1) * page.limit;
            return {
                data: await this.model.find(this.query).populate(this.refObjectNames).skip(skip).limit(page.limit).exec(),
                totalCount: await this.count()
            };
        } else {
            return {
                data: await this.model.find(this.query).populate(this.refObjectNames).exec(),
                totalCount: await this.count()
            };
        }
    }

    async count(): Promise<number> {
        return this.model.countDocuments(this.query).exec();
    }

    async findById(id: string): Promise<T> {
        return this.model.findById(id).exec();
    }

    async findOneByQuery(query: object = {}) {
        return this.model.findOne(query).populate(this.refObjectNames).exec();
    }

    async update(id: string, rec: T): Promise<T> {
        return this.model.findByIdAndUpdate(id, rec, { new: true }).exec();
    }

    async delete(id: string): Promise<T> {
        return this.model.findByIdAndRemove(id).exec();
    }

    public get hasQuery() {
        return this.query ? (Object.keys(this.query).length > 0 ? true : false) : false;
    }
}
