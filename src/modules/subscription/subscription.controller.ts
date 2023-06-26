import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';
import { SubscriptionService } from './subscription.service';
import { Subscription } from './subscription.schema';
import { ApiResponse, Response } from 'src/core/api/api.interface';
import { MongoError } from 'mongodb';

@Controller('subscription')
export class SubscriptionController {

    constructor(private subscriptionService: SubscriptionService) { }

    @Post()
    async create(@Body() subscription: Subscription): Promise<ApiResponse<Subscription | null>> {
      try {
        await this.subscriptionService.create(subscription);
        return Response.OK(subscription, 'Subscription created successfully');
      } catch (error) {
        return Response.Error(error instanceof MongoError ? error.message : 'Error creating Subscription');
      }
    }

    @Get()
    async findAll(@Query('pageNumber') pageNumber: number, @Query('limit') limit: number): Promise<ApiResponse<Subscription[] | null>> {
      
      try {
        const subscriptions = await this.subscriptionService.findAll({pageNumber, limit});
        return Response.OK(subscriptions.data, 'Subscriptions fetched successfully', await subscriptions.totalCount);
      } catch (error) {
        return Response.Error('Error fetching Subscriptions');
      }
    }

    
  @Get(':id')
  async findById(@Param('id') id: string): Promise<ApiResponse<Subscription | null>> {
    try {
      const subscription = await this.subscriptionService.findById(id);
      return Response.OK(subscription, 'Subscription fetched successfully');
    } catch (error) {
      return Response.Error('Error fetching subscription');
    }
  }

  @Put(':id')
  async updateSubscription(@Param('id') id: string, @Body() subscription: Subscription): Promise<ApiResponse<Subscription | null>> {
    try {
      const updatedSubscription = await this.subscriptionService.update(id, subscription);
      return Response.OK(updatedSubscription, 'Subscription updated successfully');
    } catch (error) {
      return Response.Error('Error updating subscription');
    }
  }

  @Delete(':id')
  async deleteSubscription(@Param('id') id: string): Promise<ApiResponse<Subscription | null>> {
    try {
      const deletedSubscription = await this.subscriptionService.delete(id);
      return Response.OK(deletedSubscription, 'Subscription deleted successfully');
    } catch (error) {
      return Response.Error('Error deleting subscription');
    }
  }
}
