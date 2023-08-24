import { Controller, Post, Body, UseGuards, HttpCode, HttpStatus, Get, Request, Req, SetMetadata } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Credential } from './credentials.interface';
import { ApiResponse, Response } from '../api/api.interface';
import { PasswordHashPipe } from 'src/pipes/password-hash.pipe';
import { UserRoleEnum } from 'src/modules/users/user.schema';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  
  @HttpCode(HttpStatus.OK)
  @Post('login')
  @SetMetadata('isPublic', true)
  async login(@Body() body: Credential): Promise<ApiResponse<boolean | null>> {
    const response = await this.authService.validateUserAndSendSmsCode(body.email, body.password, UserRoleEnum.user);
    if (response === false) {
      return Response.Error("Credentials did not match..");
    }
    return Response.OK(response, "Sms Code has been sent to your phone number..");
  }

  @HttpCode(HttpStatus.OK)
  @Post('login/smsverification')
  @SetMetadata('isPublic', true)
  async smsVerification(@Body() body: Credential): Promise<ApiResponse<string | undefined>> {
    const response = await this.authService.validateUser(body.email, body.password, body.smsCode, UserRoleEnum.user);
    if (response === undefined) {
      return Response.Error("Code Invalid or Expired");
    }
    return Response.OK(response, "Logged In");
  }
  
  @HttpCode(HttpStatus.OK)
  @Post('login/admin')
  @SetMetadata('isPublic', true)
  async loginAdmin(@Body() body: Credential): Promise<ApiResponse<string | null>> {
    const response = await this.authService.validateAdmin(body.email, body.password, UserRoleEnum.admin);
    if (response === undefined) {
      return Response.Error("Log in failed");
    }
    return Response.OK(response, "Logged In");
  }

  @Post('logout')
  async logout(@Req() request: Request): Promise<ApiResponse<string>> {
    const token = this.extractTokenFromRequest(request);

    if (token) {
      // Revoke the token
      await this.authService.revokeToken(token);
    }
    return Response.OK(null, 'Logged Out');    
  }

  @Post('forgotpassword')
  @SetMetadata('isPublic', true)
  async forgotpassword(@Body() body: Credential): Promise<ApiResponse<string>> {
    await this.authService.forgotpassEmail(body.email);
    
    return Response.OK(null, 'Reset passwork link email has been sent.');
  }

  @Post('passwordreset')
  @SetMetadata('isPublic', true)
  async passwordreset(@Body(new PasswordHashPipe()) body: {resetPasswordToken: string, email: string, password: string}): Promise<ApiResponse<string>> {
    const result = await this.authService.passwordreset(body);
    
    if (result === true) {
      return Response.OK(null, 'Reset passwork Success.');
    }
    return Response.Error('Reset passwork failed.');
  }

  private extractTokenFromRequest(request: Request): string | null {
    // Extract the token from the request headers, query parameters, or cookies
    // Implement your own logic to extract the token based on your application's requirements
    return request.headers['authorization']?.split(' ')[1] || null;
  }
}
