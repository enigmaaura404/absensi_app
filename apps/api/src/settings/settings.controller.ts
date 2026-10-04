import { Controller, Get, Put, Body, UseGuards } from '@nestjs/common';
import { SettingsService } from './settings.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { ApiResponse, SystemSettingDto, AuthUser } from '@absensi/types';

@UseGuards(JwtAuthGuard)
@Controller('settings')
export class SettingsController {
  constructor(private readonly settingsService: SettingsService) {}

  @Get()
  async findAll(): Promise<ApiResponse<SystemSettingDto[]>> {
    const data = await this.settingsService.findAll();
    return {
      success: true,
      data,
    };
  }

  @Put()
  async updateMany(
    @CurrentUser() user: AuthUser,
    @Body() body: Record<string, any>,
  ): Promise<ApiResponse<SystemSettingDto[]>> {
    const data = await this.settingsService.updateMany(body, user.email);
    return {
      success: true,
      message: 'System settings updated successfully',
      data,
    };
  }
}
