import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards, UsePipes } from '@nestjs/common';
import { BookingService } from './booking.service';
import { Booking } from './booking.schema';
import { ApiResponse, Response } from 'src/core/api/api.interface';
import { MongoError } from 'mongodb';
import { AdminGuard } from 'src/core/auth/admin.guard';
import { ReqDec } from 'src/decorators/request.decorator';
import { BookingPipe } from 'src/pipes/booking.pipe';
import { UserIdPipe } from 'src/pipes/user-id.pipe';

@Controller('booking')
export class BookingController {

  constructor(private bookingService: BookingService) { }

  @Post()
  @UsePipes(BookingPipe)
  async create(@ReqDec() booking: Booking | null): Promise<ApiResponse<Booking | null>> {
    try {
      if (booking === null) { throw new Error("Service already booked"); }
      await this.bookingService.create(booking);
      return Response.OK(booking, 'Booking created successfully');
    } catch (error) {
      return Response.Error(error instanceof MongoError ? error.message : (error.message ? error.message : 'Error creating Booking'));
    }
  }

  @Get()
  async findAll(@Query('pageNumber') pageNumber: number, @Query('limit') limit: number): Promise<ApiResponse<Booking[] | null>> {
    try {
      const bookings = await this.bookingService.findAll({pageNumber, limit});
      return Response.OK(bookings.data, 'Bookings fetched successfully', await bookings.totalCount);
    } catch (error) {
      return Response.Error('Error fetching Bookings');
    }
  }

  @Get('completed')
  async findUserCompletedServices(@Query('pageNumber') pageNumber: number, @Query('limit') limit: number, @ReqDec(new UserIdPipe()) userId:  string): Promise<ApiResponse<Booking[] | null>> {
    try {
      const bookings = await this.bookingService.userCompletedServices({pageNumber, limit}, userId);
      return Response.OK(bookings.data, 'Bookings fetched successfully', await bookings.totalCount);
    } catch (error) {
      return Response.Error('Error fetching Bookings');
    }
  }

  @Get('incompleted')
  async findUserInCompletedServices(@Query('pageNumber') pageNumber: number, @Query('limit') limit: number, @ReqDec(new UserIdPipe()) userId:  string): Promise<ApiResponse<Booking[] | null>> {
    try {
      const bookings = await this.bookingService.userInCompletedServices({pageNumber, limit}, userId);
      return Response.OK(bookings.data, 'Bookings fetched successfully', await bookings.totalCount);
    } catch (error) {
      return Response.Error('Error fetching Bookings');
    }
  }

  @Get('bookedservices')
  async allInCompletedServices(@Query('pageNumber') pageNumber: number, @Query('limit') limit: number): Promise<ApiResponse<Booking[] | null>> {
    try {
      const bookings = await this.bookingService.allInCompletedServices({pageNumber, limit});
      return Response.OK(bookings.data, 'Bookings fetched successfully', await bookings.totalCount);
    } catch (error) {
      return Response.Error('Error fetching Bookings');
    }
  }
    
  @Get(':id')
  async findById(@Param('id') id: string): Promise<ApiResponse<Booking | null>> {
    try {
      const booking = await this.bookingService.findById(id);
      return Response.OK(booking, 'Booking fetched successfully');
    } catch (error) {
      return Response.Error('Error fetching booking');
    }
  }

  @Put(':id')
  @UseGuards(AdminGuard)
  async updateBooking(@Param('id') id: string, @Body() booking: Booking): Promise<ApiResponse<Booking | null>> {
    try {
      const updatedBooking = await this.bookingService.update(id, booking);
      return Response.OK(updatedBooking, 'Booking updated successfully');
    } catch (error) {
      console.log(error);
      
      return Response.Error('Error updating booking');
    }
  }

  @Delete(':id')
  @UseGuards(AdminGuard)
  async deleteBooking(@Param('id') id: string): Promise<ApiResponse<Booking | null>> {
    try {
      const deletedBooking = await this.bookingService.delete(id);
      return Response.OK(deletedBooking, 'Booking deleted successfully');
    } catch (error) {
      return Response.Error('Error deleting booking');
    }
  }
}
