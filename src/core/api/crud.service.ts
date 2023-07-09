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

    async findAll(page?: { pageNumber: number; limit: number }, sort?: { field: string; order: 'asc' | 'desc' } ): Promise<{ data: T[]; totalCount: number }> {
        const query = this.model.find(this.query);
        
        // Apply sorting if sort options are provided
        if (sort) {
          const { field, order } = sort;
          const sortOrder = order === 'desc' ? -1 : 1;
          query.sort({ [field]: sortOrder });
        }
        
        // Apply pagination if page options are provided
        if (page && page.pageNumber && page.limit && page.pageNumber > 0 && page.limit > 0) {
          const skip = (page.pageNumber - 1) * page.limit;
          query.skip(skip).limit(page.limit);
        }
        
        // Execute the query and populate reference objects
        const data = await query.populate(this.refObjectNames).exec();
        
        // Count the total number of documents
        const totalCount = await this.count();
        
        return { data, totalCount };
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
