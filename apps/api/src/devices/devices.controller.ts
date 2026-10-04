import {
  Controller,
  Get,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { DevicesService } from './devices.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { ApiResponse, DeviceDto, AuthUser } from '@absensi/types';

@UseGuards(JwtAuthGuard)
@Controller('devices')
export class DevicesController {
  constructor(private readonly devicesService: DevicesService) {}

  @Get()
  async findAll(
    @CurrentUser() user: AuthUser,
    @Query('employeeId') employeeId?: string,
  ): Promise<ApiResponse<DeviceDto[]>> {
    const isManagerOrAdmin = user.roles.some((r) =>
      ['admin', 'superadmin', 'hr', 'manager', 'supervisor'].includes(r),
    );

    const targetEmployeeId = isManagerOrAdmin ? employeeId : user.employeeId || undefined;
    const data = await this.devicesService.findAll(targetEmployeeId);
    return {
      success: true,
      data,
    };
  }

  @Patch(':id/status')
  async updateStatus(
    @Param('id') id: string,
    @CurrentUser() user: AuthUser,
    @Body('status') status: string,
  ): Promise<ApiResponse<DeviceDto>> {
    const data = await this.devicesService.updateStatus(id, status, user.employeeId || undefined);
    return {
      success: true,
      message: `Device status updated to ${status}`,
      data,
    };
  }

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<ApiResponse<{ deleted: boolean }>> {
    await this.devicesService.delete(id);
    return {
      success: true,
      message: 'Device deleted successfully',
      data: { deleted: true },
    };
  }
}
