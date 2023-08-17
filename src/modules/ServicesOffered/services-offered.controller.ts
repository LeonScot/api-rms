import { Body, Controller, Delete, Get, Param, Post, Put, Query, Req, UseGuards } from '@nestjs/common';
import { ServicesOfferedService } from './services-offered.service';
import { ServicesOffered } from './services-offered.schema';
import { ApiResponse, Response } from 'src/core/api/api.interface';
import { MongoError } from 'mongodb';
import { AdminGuard } from 'src/core/auth/admin.guard';
import { UserSessionInfo } from 'src/core/auth/jwt.model';
import { Request } from 'express';
import { UserSession } from 'src/decorators/user-session-info.decorator';

@Controller('servicesOffered')
export class ServicesOfferedController {

  constructor(private servicesOfferedService: ServicesOfferedService) { }

  @Post()
  @UseGuards(AdminGuard)
  async create(@Body() servicesOffered: ServicesOffered): Promise<ApiResponse<ServicesOffered | null>> {
    try {
      await this.servicesOfferedService.create(servicesOffered);
      return Response.OK(servicesOffered, 'ServicesOffered created successfully');
    } catch (error) {
      return Response.Error(error instanceof MongoError ? error.message : 'Error creating ServicesOffered');
    }
  }

  @Post('sync')
  @UseGuards(AdminGuard)
  async syncServices(): Promise<ApiResponse<ServicesOffered[] | null>> {
    try {
      const services = await this.servicesOfferedService.syncServices();
      return Response.OK(services, 'ServicesOffered created successfully');
    } catch (error) {
      return Response.Error(error instanceof MongoError ? error.message : 'Error creating ServicesOffered');
    }
  }

  @Get()
  async findAll(@Query('pageNumber') pageNumber: number, @Query('limit') limit: number, @UserSession() userInfo: UserSessionInfo): Promise<ApiResponse<ServicesOffered[] | null>> {
    try {
      const servicesOffereds = await this.servicesOfferedService.findAllConditonal({pageNumber, limit}, userInfo);
      return Response.OK(servicesOffereds.data, 'ServicesOffereds fetched successfully', servicesOffereds.totalCount);
    } catch (error) {
      return Response.Error('Error fetching ServicesOffereds');
    }
  }

    
  @Get(':id')
  async findById(@Param('id') id: string): Promise<ApiResponse<ServicesOffered | null>> {
    try {
      const servicesOffered = await this.servicesOfferedService.findById(id);
      return Response.OK(servicesOffered, 'ServicesOffered fetched successfully');
    } catch (error) {
      return Response.Error('Error fetching servicesOffered');
    }
  }

  @Put(':id')
  @UseGuards(AdminGuard)
  async updateServicesOffered(@Param('id') id: string, @Body() servicesOffered: ServicesOffered): Promise<ApiResponse<ServicesOffered | null>> {
    try {
      const updatedServicesOffered = await this.servicesOfferedService.update(id, servicesOffered);
      return Response.OK(updatedServicesOffered, 'ServicesOffered updated successfully');
    } catch (error) {
      console.log(error);
      
      return Response.Error('Error updating servicesOffered');
    }
  }

  @Delete(':id')
  @UseGuards(AdminGuard)
  async deleteServicesOffered(@Param('id') id: string): Promise<ApiResponse<ServicesOffered | null>> {
    try {
      const deletedServicesOffered = await this.servicesOfferedService.delete(id);
      return Response.OK(deletedServicesOffered, 'ServicesOffered deleted successfully');
    } catch (error) {
      return Response.Error('Error deleting servicesOffered');
    }
  }
}
