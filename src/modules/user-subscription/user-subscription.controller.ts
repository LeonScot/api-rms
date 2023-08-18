import { Body, Controller, Delete, Get, Param, Patch, Post, Put, Query, UsePipes } from '@nestjs/common';
import { UserSubscriptionService } from './user-subscription.service';
import { UserSubscription } from './user-subscription.schema';
import { ApiResponse, Response } from 'src/core/api/api.interface';
import { MongoError } from 'mongodb';
import { SubscriptionPayloadPipe } from 'src/pipes/subscription-payload.pipe';
import { ReqDec } from 'src/decorators/request.decorator';
import { mongoError, mongoErrorDictionary } from 'src/helpers/helpers';

@Controller('userSubscription')
export class UserSubscriptionController {

  constructor(private userSubscriptionService: UserSubscriptionService) { }

  @Post()
  @UsePipes(SubscriptionPayloadPipe)
  async create(@ReqDec() userSubscription: UserSubscription): Promise<ApiResponse<UserSubscription | null>> {
    
    try {
      const isAlreadySubscribed = await this.userSubscriptionService.findOneByQuery({user: userSubscription.user, active: true, unsubscribed: false, expired: false});
      if (isAlreadySubscribed !== null) {
        return Response.Error(mongoErrorDictionary[UserSubscriptionController.name][11000]);
      }
      await this.userSubscriptionService.create(userSubscription);
      return Response.OK(null, 'UserSubscription created successfully');
    } catch (error) {
      return Response.Error(error instanceof MongoError ? mongoError(error, UserSubscriptionController.name) : 'Error creating record');
    }
  }

  @Get()
  async findAll(@Query('pageNumber') pageNumber: number, @Query('limit') limit: number, @Query('query') query: object = {}): Promise<ApiResponse<UserSubscription[] | null>> {
    
    try {
      this.userSubscriptionService.setQuery(query);
      const userSubscriptions = await this.userSubscriptionService.findAll({pageNumber, limit}, {field: 'createdDate', order: 'desc'});
      return Response.OK(userSubscriptions.data, 'UserSubscriptions fetched successfully', userSubscriptions.totalCount);
    } catch (error) {
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
    
  @Get('by/userId')
  async findUserSubscription(@Query() query: object = {}): Promise<ApiResponse<UserSubscription | null>> {
    try {
      query = {...query, expired: false};
      const userSubscription = await this.userSubscriptionService.findOneByQuery(query);
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

  @Patch(':id')
  async patchUserSubscription(@Param('id') id: string, @Body() userSubscription: UserSubscription): Promise<ApiResponse<UserSubscription | null>> {
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
