import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';
import { RewardService } from './reward.service';
import { Reward } from './reward.schema';
import { ApiResponse, Response } from 'src/core/api/api.interface';
import { MongoError } from 'mongodb';
import { UserSessionDecorator } from 'src/decorators/user-session-info.decorator';
import { UserSessionInfo } from 'src/core/auth/jwt.model';

@Controller('reward')
export class RewardController {

  constructor(private rewardService: RewardService) { }

  @Post()
  async create(@Body() reward: Reward): Promise<ApiResponse<Reward | null>> {
    try {
      await this.rewardService.createHasFile(reward);
      return Response.OK(reward, 'Reward created successfully');
    } catch (error) {
      return Response.Error(error instanceof MongoError ? error.message : 'Error creating Reward');
    }
  }

  @Get()
  async findAll(@Query('pageNumber') pageNumber: number, @Query('limit') limit: number, @Query('search') search: string): Promise<ApiResponse<Reward[] | null>> {
    try {
      const rewards = await this.rewardService.findAll({pageNumber, limit, search});
      return Response.OK(rewards.data, 'Rewards fetched successfully', await rewards.totalCount);
    } catch (error) {
      return Response.Error('Error fetching Rewards');
    }
  }

  @Get('visitrewards')
  async visitRewards(@Query('pageNumber') pageNumber: number, @Query('limit') limit: number, @UserSessionDecorator() userInfo: UserSessionInfo): Promise<ApiResponse<Reward[] | null>> {
    try {
      const rewards = await this.rewardService.findAllVisitRewards({pageNumber, limit}, userInfo.role);
      return Response.OK(rewards.data, 'Rewards fetched successfully', await rewards.totalCount);
    } catch (error) {
      return Response.Error('Error fetching Rewards');
    }
  }

    
  @Get(':id')
  async findById(@Param('id') id: string): Promise<ApiResponse<Reward | null>> {
    try {
      const reward = await this.rewardService.findById(id);
      return Response.OK(reward, 'Reward fetched successfully');
    } catch (error) {
      return Response.Error('Error fetching reward');
    }
  }

  @Put(':id')
  async updateReward(@Param('id') id: string, @Body() reward: Reward): Promise<ApiResponse<Reward | null>> {
    try {
      const updatedReward = await this.rewardService.update(id, reward);
      return Response.OK(updatedReward, 'Reward updated successfully');
    } catch (error) {
      return Response.Error('Error updating reward');
    }
  }

  @Delete(':id')
  async deleteReward(@Param('id') id: string): Promise<ApiResponse<Reward | null>> {
    try {
      const deletedReward = await this.rewardService.delete(id);
      return Response.OK(deletedReward, 'Reward deleted successfully');
    } catch (error) {
      return Response.Error('Error deleting reward');
    }
  }
}
