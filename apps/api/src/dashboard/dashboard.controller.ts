import { Controller, Get, UseGuards } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { ApiResponse, DashboardStatsDto } from '@absensi/types';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Roles('admin', 'superadmin', 'hr', 'manager', 'supervisor')
  @Get('stats')
  async getStats(): Promise<ApiResponse<DashboardStatsDto>> {
    const data = await this.dashboardService.getStats();
    return {
      success: true,
      data,
    };
  }
}
