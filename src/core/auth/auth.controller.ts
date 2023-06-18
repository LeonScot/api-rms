import { Controller, Post, Body, UseGuards, HttpCode, HttpStatus, Get, Request, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Credential } from './credentials.interface';
import { AuthGuard } from './auth.guard';
import { ApiResponse } from '../api/api.interface';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  
  @HttpCode(HttpStatus.OK)
  @Post('login')
  async login(@Body() body: Credential): Promise<ApiResponse<string | null>> {
    const response = await this.authService.validateUser(body.email, body.password);
    if (response === undefined) {
        return {
            data: null,
            status: 'error',
            message: "Log in failed"
        };
    }
    return {
        data: response,
        status: 'success',
        message: "Logged In"
    };
  }

  @Post('logout')
  @UseGuards(AuthGuard)
  async logout(@Req() request: Request): Promise<ApiResponse<string>> {
    const token = this.extractTokenFromRequest(request);

    if (token) {
      // Revoke the token
      await this.authService.revokeToken(token);
    }

    return {
      status: 'success',
      data: null,
      message: 'Logged Out'
    }
    
  }

  private extractTokenFromRequest(request: Request): string | null {
    // Extract the token from the request headers, query parameters, or cookies
    // Implement your own logic to extract the token based on your application's requirements
    return request.headers['authorization']?.split(' ')[1] || null;
  }

  @UseGuards(AuthGuard)
  @Get('profile')
  getProfile() {
    return "req.user";
  }
}
