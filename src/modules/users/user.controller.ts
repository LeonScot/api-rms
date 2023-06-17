import { Controller, Post, Body, Get, Param, Put, Delete, HttpException, HttpStatus } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './user.schema';
import { ApiResponse } from './../../core/api/api.interface';
import { MongoError } from 'mongodb';
import { AssignVerificationTokenPipe } from 'src/pipes/assign-verification-token.pipe';
import { PasswrodHashPipe } from 'src/pipes/password-hash.pipe';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async createUser(@Body(new AssignVerificationTokenPipe(), new PasswrodHashPipe()) user: User): Promise<ApiResponse<User | null>> {
    try {
      await this.userService.create(user);
      return {
        status: 'success',
        data: user,
        message: 'User created successfully',
      };
    } catch (error) {
      return {
        status: 'error',
        data: null,
        message: error instanceof MongoError ? error.message : 'Error creating user',
      };
    }
  }

  @Get()
  async findAllUsers(): Promise<ApiResponse<User[] | null>> {
    try {
      const users = await this.userService.findAll();
      return {
        status: 'success',
        data: users,
        message: 'Users fetched successfully',
      };
    } catch (error) {
      return {
        status: 'error',
        data: null,
        message: 'Error fetching users',
      };
    }
  }

  @Get(':id')
  async findUserById(@Param('id') id: string): Promise<ApiResponse<User | null>> {
    try {
      const user = await this.userService.findById(id);
      return {
        status: 'success',
        data: user,
        message: 'User fetched successfully',
      };
    } catch (error) {
      return {
        status: 'error',
        data: null,
        message: 'Error fetching user',
      };
    }
  }

  @Put(':id')
  async updateUser(@Param('id') id: string, @Body() user: User): Promise<ApiResponse<User | null>> {
    try {
      const updatedUser = await this.userService.update(id, user);
      return {
        status: 'success',
        data: updatedUser,
        message: 'User updated successfully',
      };
    } catch (error) {
      return {
        status: 'error',
        data: null,
        message: 'Error updating user',
      };
    }
  }

  @Delete(':id')
  async deleteUser(@Param('id') id: string): Promise<ApiResponse<User | null>> {
    try {
      const deletedUser = await this.userService.delete(id);
      return {
        status: 'success',
        data: deletedUser,
        message: 'User deleted successfully',
      };
    } catch (error) {
      return {
        status: 'error',
        data: null,
        message: 'Error deleting user',
      };
    }
  }
}
