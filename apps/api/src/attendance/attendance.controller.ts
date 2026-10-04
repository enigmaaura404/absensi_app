import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Query,
  Param,
  UseGuards,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { AttendanceService } from './attendance.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import {
  AuthUser,
  CheckInRequestDto,
  CheckOutRequestDto,
  ApiResponse,
  AttendanceRecordDto,
  PaginatedResponse,
} from '@absensi/types';

@UseGuards(JwtAuthGuard)
@Controller('attendance')
export class AttendanceController {
  constructor(private readonly attendanceService: AttendanceService) {}

  // ──────────────────────────────────────────────────────────────────────────────
  // Employee: Get own today's attendance
  // ──────────────────────────────────────────────────────────────────────────────

  @Get('today')
  async getTodayAttendance(
    @CurrentUser() user: AuthUser,
  ): Promise<ApiResponse<AttendanceRecordDto | null>> {
    if (!user.employeeId) {
      throw new BadRequestException('User is not linked to an employee profile');
    }
    const data = await this.attendanceService.getTodayAttendance(user.employeeId);
    return { success: true, data };
  }

  // ──────────────────────────────────────────────────────────────────────────────
  // Admin/HR/Manager: Get ALL employees' today attendance
  // ──────────────────────────────────────────────────────────────────────────────

  @Get('today/team')
  async getTodayTeamAttendance(
    @CurrentUser() user: AuthUser,
    @Query('departmentId') departmentId?: string,
    @Query('status') status?: string,
    @Query('page') page?: string,
    @Query('pageSize') pageSize?: string,
  ): Promise<ApiResponse<PaginatedResponse<AttendanceRecordDto>>> {
    const hasAccess = user.roles.some((r) =>
      ['admin', 'superadmin', 'hr', 'manager', 'supervisor'].includes(r),
    );
    if (!hasAccess) {
      throw new ForbiddenException('Insufficient permissions to view team attendance');
    }

    const data = await this.attendanceService.getTodayAttendanceAll({
      departmentId,
      status,
      page: page ? parseInt(page, 10) : 1,
      pageSize: pageSize ? parseInt(pageSize, 10) : 50,
    });

    return { success: true, data };
  }

  // ──────────────────────────────────────────────────────────────────────────────
  // Check-In
  // ──────────────────────────────────────────────────────────────────────────────

  @Post('check-in')
  async checkIn(
    @CurrentUser() user: AuthUser,
    @Body() dto: CheckInRequestDto,
  ): Promise<ApiResponse<AttendanceRecordDto>> {
    if (!user.employeeId) {
      throw new BadRequestException('User is not linked to an employee profile');
    }
    const data = await this.attendanceService.checkIn(user.employeeId, dto);
    return {
      success: true,
      message: 'Check-in berhasil dicatat',
      data,
    };
  }

  // ──────────────────────────────────────────────────────────────────────────────
  // Check-Out
  // ──────────────────────────────────────────────────────────────────────────────

  @Post('check-out')
  async checkOut(
    @CurrentUser() user: AuthUser,
    @Body() dto: CheckOutRequestDto,
  ): Promise<ApiResponse<AttendanceRecordDto>> {
    if (!user.employeeId) {
      throw new BadRequestException('User is not linked to an employee profile');
    }
    const data = await this.attendanceService.checkOut(user.employeeId, dto);
    return {
      success: true,
      message: 'Check-out berhasil dicatat',
      data,
    };
  }

  // ──────────────────────────────────────────────────────────────────────────────
  // Attendance History — scoped by role
  // ──────────────────────────────────────────────────────────────────────────────

  @Get('history')
  async getHistory(
    @CurrentUser() user: AuthUser,
    @Query('employeeId') employeeId?: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
    @Query('status') status?: string,
    @Query('departmentId') departmentId?: string,
    @Query('page') page?: string,
    @Query('pageSize') pageSize?: string,
  ): Promise<ApiResponse<PaginatedResponse<AttendanceRecordDto>>> {
    const isManagerOrAdmin = user.roles.some((r) =>
      ['admin', 'superadmin', 'hr', 'manager', 'supervisor'].includes(r),
    );

    let targetEmployeeId: string | undefined;
    if (isManagerOrAdmin) {
      targetEmployeeId = employeeId || undefined;
    } else {
      targetEmployeeId = user.employeeId || undefined;
      departmentId = undefined; // Employees cannot filter by department
    }

    const data = await this.attendanceService.getAttendanceHistory(
      targetEmployeeId,
      startDate,
      endDate,
      status,
      isManagerOrAdmin ? departmentId : undefined,
      page ? parseInt(page, 10) : 1,
      pageSize ? parseInt(pageSize, 10) : 20,
    );

    return { success: true, data };
  }

  // ──────────────────────────────────────────────────────────────────────────────
  // Bulk Delete — Admin/HR/Superadmin only
  // ──────────────────────────────────────────────────────────────────────────────

  @Delete('bulk')
  async bulkDelete(
    @CurrentUser() user: AuthUser,
    @Body() body: { ids: string[] },
  ): Promise<ApiResponse<{ deleted: number }>> {
    const hasAccess = user.roles.some((r) =>
      ['admin', 'superadmin', 'hr'].includes(r),
    );
    if (!hasAccess) {
      throw new ForbiddenException('Hanya Admin/HR yang dapat menghapus data kehadiran');
    }

    if (!body.ids || body.ids.length === 0) {
      throw new BadRequestException('IDs array tidak boleh kosong');
    }

    const data = await this.attendanceService.bulkDeleteAttendance(body.ids);
    return {
      success: true,
      message: `${data.deleted} catatan kehadiran berhasil dihapus`,
      data,
    };
  }
}
