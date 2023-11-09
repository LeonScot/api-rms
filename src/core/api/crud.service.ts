import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { IPagination, ISort } from './api.interface';

@Injectable()
export abstract class CrudService<T> {

    private query: object = {};
    
    private excludedQuery: object = {};

    public refObjectNames: string[] = [];

    public searchFields: string[] = [];

    constructor(private readonly model: Model<T>) {}

    async create(rec: T): Promise<T> {
        const createdRec = new this.model(rec);
        return createdRec.save();
    }

    async findAll(page?: IPagination, sort?: ISort): Promise<{ data: T[]; totalCount: number }> {
        const query = this.model.find(this.query);
    
        // Add search functionality
        if (page && page.search && this.searchFields.length) {
            
            // Create a regular expression to match the search string case-insensitively
            const searchRegExp = new RegExp(page.search, 'i');
    
            // Generate an OR condition for each field
            const orConditions = this.searchFields.reduce((conditions, key) => {
                if (!key.includes('.')) {
                    conditions.push({ [key]: searchRegExp });
                }
                return conditions;
            }, []);
    
            // Add the OR conditions to the query
            query.or(orConditions);
        }
    
        // Exclude documents
        if (this.excludedQuery) {
            for (const key in this.excludedQuery) {
                if (Object.prototype.hasOwnProperty.call(this.excludedQuery, key)) {
                    const element = this.excludedQuery[key];
                    query.where(key).nin(element);
                }
            }
        }
    
        // Apply sorting if sort options are provided
        if (sort) {
            const { field, order } = sort;
            const sortOrder = order === 'desc' ? -1 : 1;
            query.sort({ [field]: sortOrder });
        }
        
        const totalCount = await this.model.countDocuments(query).exec();

        // Apply pagination if page options are provided
        if (page && page.pageNumber && page.limit && page.pageNumber > 0 && page.limit > 0) {
            const skip = (page.pageNumber - 1) * page.limit;
            query.skip(skip).limit(page.limit);
        }
    
        // Execute the query and populate reference objects
        const data = await query.populate(this.refObjectNames).exec();
    
        // Count the total number of documents
        // const totalCount = await this.count();
    
        this.resetQuery();
        this.resetExcludedQuery();
    
        return { data, totalCount };
    }    

    /** Suitable when use in a loop */
    async findAllDirectQuery(queryDirect: object | null = null, page: IPagination | null = null, sort: ISort | null = null ): Promise<{ data: T[]; totalCount: number }> {
        const query = this.model.find(queryDirect);
        
        // Exclude documents
        // if (this.excludedQuery) {
        //     for (const key in this.excludedQuery) {
        //         if (Object.prototype.hasOwnProperty.call(this.excludedQuery, key)) {
        //             const element = this.excludedQuery[key];
        //             query.where(key).nin(element);
        //         }
        //     }
        // }
        
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
        const totalCount = await this.model.countDocuments(queryDirect).exec();
        
        return { data, totalCount };
    }

    async count(): Promise<number> {
        return this.model.countDocuments(this.query).exec();
    }

    async findById(id: string) {
        return this.model.findById(id).populate(this.refObjectNames).exec();
    }

    async findOneByQuery(query: object = {}, sort: ISort | null = null) {

        const queryExe = this.model.findOne(query);
        if (sort !== null) {
            const { field, order } = sort;
            const sortOrder = order === 'desc' ? -1 : 1;
            queryExe.sort({ [field]: sortOrder });
        }
        return queryExe.populate(this.refObjectNames).exec();
    }

    async update(id: string, rec: T): Promise<T> {
        return this.model.findByIdAndUpdate(id, rec, { new: true }).exec();
    }

    async updateManyByQuery(query: object, update: object): Promise<number> {
        // Update multiple documents that match the query with the provided update
        const updateExe = { $set: update };
        const updateResult = await this.model.updateMany(query, updateExe).exec();
    
        // Return the number of documents updated
        return updateResult.modifiedCount;
    }

    async delete(id: string): Promise<T> {
        return this.model.findByIdAndRemove(id).exec();
    }

    setQuery(query: object) {
        this.query = query;
    }

    resetQuery() {
        this.query = {};
    }

    setExcludedQuery(query: object) {
        this.excludedQuery = query;
    }

    resetExcludedQuery() {
        this.excludedQuery = {};
    }
}
