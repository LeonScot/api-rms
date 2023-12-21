import { Body, Controller, Delete, Get, Param, Post, Put, Query, SetMetadata } from '@nestjs/common';
import { UserRewardService } from './user-reward.service';
import { UserReward } from './user-reward.schema';
import { ApiResponse, Response } from 'src/core/api/api.interface';
import { MongoError } from 'mongodb';
import { UserSessionInfo } from 'src/core/auth/jwt.model';
import { UserSessionDecorator } from 'src/decorators/user-session-info.decorator';

@Controller('userReward')
export class UserRewardController {

  constructor(private userRewardService: UserRewardService) { }

  @Post()
  async create(@Body() userReward: UserReward): Promise<ApiResponse<UserReward | null>> {
    try {
      await this.userRewardService.create(userReward);
      return Response.OK(userReward, 'UserReward created successfully');
    } catch (error) {
      return Response.Error(error instanceof MongoError ? error.message : 'Error creating UserReward');
    }
  }

  @Get()
  async findAll(@Query('pageNumber') pageNumber: number, @Query('limit') limit: number): Promise<ApiResponse<UserReward[] | null>> {
    try {
      const userRewards = await this.userRewardService.findAll({pageNumber, limit}, {field: 'createdDate', order: 'desc'});
      return Response.OK(userRewards.data, 'UserRewards fetched successfully', await userRewards.totalCount);
    } catch (error) {
      return Response.Error('Error fetching UserRewards');
    }
  }

  @Get('userownrewards')
  async userOwnRewards(@Query('pageNumber') pageNumber: number, @Query('limit') limit: number, @UserSessionDecorator() userInfo: UserSessionInfo): Promise<ApiResponse<UserReward[] | null>> {
    try {
      const userRewards = await this.userRewardService.getUserOwnRewards(userInfo.sub, {pageNumber, limit});
      return Response.OK(userRewards.data, 'UserRewards fetched successfully', await userRewards.totalCount);
    } catch (error) {
      return Response.Error('Error fetching UserRewards');
    }
  }

  @Post('cron')
  async cronCheck(): Promise<ApiResponse<UserReward[] | null>> {
    try {
      const userRewards = await this.userRewardService.cronToAssignUserReward();
      return Response.OK(null, 'UserRewards fetched successfully', 0);
    } catch (error) {
      return Response.Error('Error fetching UserRewards');
    }
  }

  @Post('cron_monthly_reward')
  @SetMetadata('isPublic', true)
  async cronMonthlyReward(): Promise<ApiResponse<UserReward[] | null>> {
    try {
      const userRewards = await this.userRewardService.cronVipsMonthlyReward();
      return Response.OK(null, 'UserRewards fetched successfully', 0);
    } catch (error) {
      return Response.Error('Error fetching UserRewards');
    }
  }

    
  @Get(':id')
  async findById(@Param('id') id: string): Promise<ApiResponse<UserReward | null>> {
    try {
      const userReward = await this.userRewardService.findById(id);
      return Response.OK(userReward, 'UserReward fetched successfully');
    } catch (error) {
      return Response.Error('Error fetching userReward');
    }
  }

  @Put(':id')
  async updateUserReward(@Param('id') id: string, @Body() userReward: UserReward): Promise<ApiResponse<UserReward | null>> {
    try {
      const updatedUserReward = await this.userRewardService.update(id, userReward);
      return Response.OK(updatedUserReward, 'UserReward updated successfully');
    } catch (error) {
      return Response.Error('Error updating userReward');
    }
  }

  @Delete(':id')
  async deleteUserReward(@Param('id') id: string): Promise<ApiResponse<UserReward | null>> {
    try {
      const deletedUserReward = await this.userRewardService.delete(id);
      return Response.OK(deletedUserReward, 'UserReward deleted successfully');
    } catch (error) {
      return Response.Error('Error deleting userReward');
    }
  }
}
