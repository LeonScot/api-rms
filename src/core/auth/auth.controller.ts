import { Controller, Post, Body, UseGuards, HttpCode, HttpStatus, Get, Request } from '@nestjs/common';
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

  @UseGuards(AuthGuard)
  @Get('profile')
  getProfile() {
    return "req.user";
  }
}
