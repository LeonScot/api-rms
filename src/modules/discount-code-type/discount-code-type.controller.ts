import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';
import { DiscountCodeTypeService } from './discount-code-type.service';
import { DiscountCodeType } from './discount-code-type.schema';
import { ApiResponse, Response } from 'src/core/api/api.interface';
import { MongoError } from 'mongodb';

@Controller('discountCodeType')
export class DiscountCodeTypeController {

  constructor(private discountCodeTypeService: DiscountCodeTypeService) { }

  @Post()
  async create(@Body() discountCodeType: DiscountCodeType): Promise<ApiResponse<DiscountCodeType | null>> {
    try {
      await this.discountCodeTypeService.create(discountCodeType);
      return Response.OK(discountCodeType, 'DiscountCodeType created successfully');
    } catch (error) {
      return Response.Error(error instanceof MongoError ? error.message : 'Error creating DiscountCodeType');
    }
  }

  @Get()
  async findAll(@Query('pageNumber') pageNumber: number, @Query('limit') limit: number): Promise<ApiResponse<DiscountCodeType[] | null>> {
    
    try {
      const discountCodeTypes = await this.discountCodeTypeService.findAll({pageNumber, limit});
      return Response.OK(discountCodeTypes, 'DiscountCodeTypes fetched successfully', await this.discountCodeTypeService.count());
    } catch (error) {
      return Response.Error('Error fetching DiscountCodeTypes');
    }
  }

    
  @Get(':id')
  async findById(@Param('id') id: string): Promise<ApiResponse<DiscountCodeType | null>> {
    try {
      const discountCodeType = await this.discountCodeTypeService.findById(id);
      return Response.OK(discountCodeType, 'DiscountCodeType fetched successfully');
    } catch (error) {
      return Response.Error('Error fetching discountCodeType');
    }
  }

  @Put(':id')
  async updateDiscountCodeType(@Param('id') id: string, @Body() discountCodeType: DiscountCodeType): Promise<ApiResponse<DiscountCodeType | null>> {
    try {
      const updatedDiscountCodeType = await this.discountCodeTypeService.update(id, discountCodeType);
      return Response.OK(updatedDiscountCodeType, 'DiscountCodeType updated successfully');
    } catch (error) {
      return Response.Error('Error updating discountCodeType');
    }
  }

  @Delete(':id')
  async deleteDiscountCodeType(@Param('id') id: string): Promise<ApiResponse<DiscountCodeType | null>> {
    try {
      const deletedDiscountCodeType = await this.discountCodeTypeService.delete(id);
      return Response.OK(deletedDiscountCodeType, 'DiscountCodeType deleted successfully');
    } catch (error) {
      return Response.Error('Error deleting discountCodeType');
    }
  }
}
