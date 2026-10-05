import { Controller, Post, Get, Body, UseGuards, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard, Public } from './guards/jwt-auth.guard';
import { CurrentUser } from './decorators/current-user.decorator';
import { LoginRequestDto, ApiResponse, LoginResponseDto, AuthUser } from '@absensi/types';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() dto: LoginRequestDto): Promise<ApiResponse<LoginResponseDto>> {
    const data = await this.authService.login(dto);
    return {
      success: true,
      message: 'Login successful',
      data,
    };
  }

  @Public()
  @Post('2fa/verify')
  @HttpCode(HttpStatus.OK)
  async verify2FA(
    @Body() body: { sessionId: string; otp: string },
  ): Promise<ApiResponse<LoginResponseDto>> {
    const data = await this.authService.verify2FA(body.sessionId, body.otp);
    return { success: true, message: 'Login successful', data };
  }

  @Public()
  @Post('2fa/resend')
  @HttpCode(HttpStatus.OK)
  async resend2FA(
    @Body() body: { sessionId: string },
  ): Promise<ApiResponse<{ sessionId: string }>> {
    const data = await this.authService.resend2FA(body.sessionId);
    return { success: true, message: 'OTP resent successfully', data };
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getProfile(@CurrentUser() user: AuthUser): Promise<ApiResponse<AuthUser>> {
    const profile = await this.authService.getCurrentUser(user.id);
    return {
      success: true,
      data: profile,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  @HttpCode(HttpStatus.OK)
  async logout(): Promise<ApiResponse<{ message: string }>> {
    return {
      success: true,
      message: 'Logged out successfully',
      data: { message: 'Session closed' },
    };
  }
}
