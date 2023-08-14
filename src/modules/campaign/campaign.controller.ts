import { Body, Controller, Delete, Get, Param, Post, Put, Query, Req } from '@nestjs/common';
import { CampaignService } from './campaign.service';
import { Campaign } from './campaign.schema';
import { ApiResponse, Response } from 'src/core/api/api.interface';
import { MongoError } from 'mongodb';
import { Request } from 'express';
import { JwtPayload } from 'src/core/auth/jwt.model';
import { UserRoleEnum } from '../users/user.schema';

@Controller('campaign')
export class CampaignController {

    constructor(private campaignService: CampaignService) { }

    @Post()
    async create(@Body() campaign: Campaign): Promise<ApiResponse<Campaign | null>> {
      try {
        await this.campaignService.createHasFile(campaign);
        return Response.OK(campaign, 'Campaign created successfully');
      } catch (error) {
        return Response.Error(error instanceof MongoError ? error.message : 'Error creating Campaign');
      }
    }

    @Get()
    async findAll(@Query('pageNumber') pageNumber: number, @Query('limit') limit: number, @Req() request: Request): Promise<ApiResponse<Campaign[] | null>> {
      const user: JwtPayload = request['user'];
      this.campaignService.setQuery(user.role === UserRoleEnum.user ?  {
        $and: [
          { startDate: { $lte: new Date() } },
          { endDate: { $gte: new Date() } },
        ],
      } : {});
      try {
        const campaigns = await this.campaignService.findAll({pageNumber, limit});
        return Response.OK(campaigns.data, 'Campaigns fetched successfully', await campaigns.totalCount);
      } catch (error) {
        return Response.Error('Error fetching Campaigns');
      }
    }

    
  @Get(':id')
  async findById(@Param('id') id: string): Promise<ApiResponse<Campaign | null>> {
    try {
      const campaign = await this.campaignService.findById(id);
      return Response.OK(campaign, 'Campaign fetched successfully');
    } catch (error) {
      return Response.Error('Error fetching campaign');
    }
  }

  @Put(':id')
  async updateCampaign(@Param('id') id: string, @Body() campaign: Campaign): Promise<ApiResponse<Campaign | null>> {
    try {
      const updatedCampaign = await this.campaignService.update(id, campaign);
      return Response.OK(updatedCampaign, 'Campaign updated successfully');
    } catch (error) {
      console.log(error);
      
      return Response.Error('Error updating campaign');
    }
  }

  @Delete(':id')
  async deleteCampaign(@Param('id') id: string): Promise<ApiResponse<Campaign | null>> {
    try {
      const deletedCampaign = await this.campaignService.delete(id);
      return Response.OK(deletedCampaign, 'Campaign deleted successfully');
    } catch (error) {
      return Response.Error('Error deleting campaign');
    }
  }
}
