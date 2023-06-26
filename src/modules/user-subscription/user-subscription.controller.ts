import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';
import { UserSubscriptionService } from './user-subscription.service';
import { UserSubscription } from './user-subscription.schema';
import { ApiResponse, Response } from 'src/core/api/api.interface';
import { MongoError } from 'mongodb';

@Controller('userSubscription')
export class UserSubscriptionController {

  constructor(private userSubscriptionService: UserSubscriptionService) { }

  @Post()
  async create(@Body() userSubscription: UserSubscription): Promise<ApiResponse<UserSubscription | null>> {
    try {
      await this.userSubscriptionService.create(userSubscription);
      return Response.OK(userSubscription, 'UserSubscription created successfully');
    } catch (error) {
      return Response.Error(error instanceof MongoError ? error.message : 'Error creating UserSubscription');
    }
  }

  @Get()
  async findAll(@Query('pageNumber') pageNumber: number, @Query('limit') limit: number): Promise<ApiResponse<UserSubscription[] | null>> {
    
    try {
      const userSubscriptions = await this.userSubscriptionService.findAll({pageNumber, limit});
      return Response.OK(userSubscriptions.data, 'UserSubscriptions fetched successfully', userSubscriptions.totalCount);
    } catch (error) {
      console.log(error);
      
      return Response.Error('Error fetching UserSubscriptions');
    }
  }

    
  @Get(':id')
  async findById(@Param('id') id: string): Promise<ApiResponse<UserSubscription | null>> {
    try {
      const userSubscription = await this.userSubscriptionService.findById(id);
      return Response.OK(userSubscription, 'UserSubscription fetched successfully');
    } catch (error) {
      return Response.Error('Error fetching userSubscription');
    }
  }

  @Put(':id')
  async updateUserSubscription(@Param('id') id: string, @Body() userSubscription: UserSubscription): Promise<ApiResponse<UserSubscription | null>> {
    try {
      const updatedUserSubscription = await this.userSubscriptionService.update(id, userSubscription);
      return Response.OK(updatedUserSubscription, 'UserSubscription updated successfully');
    } catch (error) {
      return Response.Error('Error updating userSubscription');
    }
  }

  @Delete(':id')
  async deleteUserSubscription(@Param('id') id: string): Promise<ApiResponse<UserSubscription | null>> {
    try {
      const deletedUserSubscription = await this.userSubscriptionService.delete(id);
      return Response.OK(deletedUserSubscription, 'UserSubscription deleted successfully');
    } catch (error) {
      return Response.Error('Error deleting userSubscription');
    }
  }
}
