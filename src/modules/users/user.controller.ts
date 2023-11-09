import { Controller, Post, Body, Get, Param, Put, Delete, Query, SetMetadata, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { User, UserRoleEnum } from './user.schema';
import { ApiResponse, Response } from './../../core/api/api.interface';
import { MongoError } from 'mongodb';
import { AssignVerificationTokenPipe } from 'src/pipes/assign-verification-token.pipe';
import { PasswordHashPipe } from 'src/pipes/password-hash.pipe';
import { MailService } from 'src/core/email/mail.service';
import { AdminGuard } from 'src/core/auth/admin.guard';
import { SmsService } from 'src/core/sms/sms.service';
import { UserSessionDecorator } from 'src/decorators/user-session-info.decorator';
import { UserSessionInfo } from 'src/core/auth/jwt.model';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService, private mailService: MailService, private smsService: SmsService) {}

  @Post()
  @SetMetadata('isPublic', true)
  async createUser(@Body(new AssignVerificationTokenPipe(), new PasswordHashPipe()) user: User, @Query('code') code: string): Promise<ApiResponse<User | null>> {
    try {
      if (user.role === UserRoleEnum.user) {
        const verified = await this.smsService.verifyCode(user.phoneNumber, code);
        if (verified === false) {
          return Response.Error("Incorrect code phone number verification failed");
        }
      }
      await this.userService.createHasFile(user);
      await this.mailService.sendUserConfirmation(user);
      return Response.OK(user, 'User created successfully');
    } catch (error) {
      return Response.Error(error instanceof MongoError ? error.message : 'Error creating user');
    }
  }

  @Post('verify')
  @SetMetadata('isPublic', true)
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
  @UseGuards(AdminGuard)
  async findAllUsers(@Query('pageNumber') pageNumber: number, @Query('limit') limit: number, @Query('search') search: string, @Query('userType') userType: UserRoleEnum): Promise<ApiResponse<User[] | null>> {
    
    try {
      const users = userType === UserRoleEnum.user ? await this.userService.getClients({pageNumber, limit, search}) : (userType === UserRoleEnum.admin ? await this.userService.getAdmins({pageNumber, limit, search}) : {data: [], totalCount: 0});
      return Response.OK(users.data, 'Users fetched successfully', users.totalCount);
    } catch (error) {
      return Response.Error('Error fetching users');
    }
  }

  @Get(':id')
  @UseGuards(AdminGuard)
  async findUserById(@Param('id') id: string): Promise<ApiResponse<User | null>> {
    try {
      const user = await this.userService.findById(id);
      return Response.OK(user, 'User fetched successfully');
    } catch (error) {
      return Response.Error('Error fetching user');
    }
  }

  @Get('settings/myprofile')
  async getMyProfile(@UserSessionDecorator() userInfo: UserSessionInfo): Promise<ApiResponse<User | null>> {
    try {
      const user = await this.userService.findById(userInfo.sub);
      return Response.OK(user, 'User profile fetched successfully');
    } catch (error) {
      return Response.Error('Error fetching user profile');
    }
  }

  @Put(':id')
  @UseGuards(AdminGuard)
  async updateUser(@Param('id') id: string, @Body() user: User): Promise<ApiResponse<User | null>> {
    try {
      const updatedUser = await this.userService.update(id, user);
      return Response.OK(updatedUser, 'User updated successfully');
    } catch (error) {
      return Response.Error('Error updating user');
    }
  }

  @Delete(':id')
  @UseGuards(AdminGuard)
  async deleteUser(@Param('id') id: string): Promise<ApiResponse<User | null>> {
    try {
      const deletedUser = await this.userService.delete(id);
      return Response.OK(deletedUser, 'User deleted successfully');
    } catch (error) {
      return Response.Error('Error deleting user');
    }
  }

  @Post('2faenable')
  async twoFAEnable(@UserSessionDecorator() userInfo: UserSessionInfo) {
    try {
      if (userInfo.role !== UserRoleEnum.user) { return; }
      await this.userService.twoFaEnable(userInfo.sub);
      return Response.OK(null, '2FA Enabled successfully');
    } catch (error) {
      return Response.Error('Enabling 2FA failed');
    }
  }

  @Post('2fadisable')
  async twoFADisable(@UserSessionDecorator() userInfo: UserSessionInfo) {
    try {
      if (userInfo.role !== UserRoleEnum.user) { return; }
      await this.userService.twoFaDisable(userInfo.sub);
      return Response.OK(null, '2FA Disabled successfully');
    } catch (error) {
      return Response.Error('Disabling 2FA failed');
    }
  }

  @Post('bgcolor')
  async bgColor(@Body() body: {backGroundColor: string}, @UserSessionDecorator() userInfo: UserSessionInfo) {
    try {
      if (userInfo.role !== UserRoleEnum.user) { return; }
      await this.userService.saveBgColor(userInfo.sub, body.backGroundColor);
      return Response.OK(null, 'backGroundColor udpated successfully');
    } catch (error) {
      return Response.Error('backGroundColor udpate failed');
    }
  }
}
