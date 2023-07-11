import { Controller, Post, Body, Get, Param, Put, Delete, Query } from '@nestjs/common';
import { UserService } from './user.service';
import { User, UserRoleEnum } from './user.schema';
import { ApiResponse, Response } from './../../core/api/api.interface';
import { MongoError } from 'mongodb';
import { AssignVerificationTokenPipe } from 'src/pipes/assign-verification-token.pipe';
import { PasswordHashPipe } from 'src/pipes/password-hash.pipe';
import { MailService } from 'src/core/email/mail.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService, private mailService: MailService) {}

  @Post()
  async createUser(@Body(new AssignVerificationTokenPipe(), new PasswordHashPipe()) user: User): Promise<ApiResponse<User | null>> {
    try {
      await this.userService.create(user);
      await this.mailService.sendUserConfirmation(user);
      return Response.OK(user, 'User created successfully');
    } catch (error) {
      return Response.Error(error instanceof MongoError ? error.message : 'Error creating user');
    }
  }

  @Post('verify')
  async userVerify(@Body() data: {token: string}): Promise<ApiResponse<string | null>> {
    try {
      
      const user = await this.userService.findByVerificationCode(data.token);

      if (user.verified === false) {
        user.verified = true;
        await this.userService.update(user._id, user);
        return Response.OK(null, 'User verified successfully');
      } else {
        return Response.OK(null, 'User already verified');
      }
    } catch (error) {
      return Response.Error(error instanceof MongoError ? error.message : 'Error in verifying user');
      
    }
  }

  @Get()
  async findAllUsers(@Query('pageNumber') pageNumber: number, @Query('limit') limit: number, @Query('userType') userType: UserRoleEnum): Promise<ApiResponse<User[] | null>> {
    
    try {
      const users = userType === UserRoleEnum.user ? await this.userService.getClients({pageNumber, limit}) : (userType === UserRoleEnum.admin ? await this.userService.getAdmins({pageNumber, limit}) : {data: [], totalCount: 0});
      return Response.OK(users.data, 'Users fetched successfully', users.totalCount);
    } catch (error) {
      return Response.Error('Error fetching users');
    }
  }

  @Get(':id')
  async findUserById(@Param('id') id: string): Promise<ApiResponse<User | null>> {
    try {
      const user = await this.userService.findById(id);
      return Response.OK(user, 'User fetched successfully');
    } catch (error) {
      return Response.Error('Error fetching user');
    }
  }

  @Put(':id')
  async updateUser(@Param('id') id: string, @Body() user: User): Promise<ApiResponse<User | null>> {
    try {
      const updatedUser = await this.userService.update(id, user);
      return Response.OK(updatedUser, 'User updated successfully');
    } catch (error) {
      return Response.Error('Error updating user');
    }
  }

  @Delete(':id')
  async deleteUser(@Param('id') id: string): Promise<ApiResponse<User | null>> {
    try {
      const deletedUser = await this.userService.delete(id);
      return Response.OK(deletedUser, 'User deleted successfully');
    } catch (error) {
      return Response.Error('Error deleting user');
    }
  }
}
