import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  Query,
  UseGuards,
  BadRequestException,
} from '@nestjs/common';
import { RequestsService } from './requests.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import {
  AuthUser,
  CreateLeaveRequestDto,
  LeaveRequestDto,
  ApprovalActionDto,
  ApiResponse,
  PaginatedResponse,
} from '@absensi/types';

@UseGuards(JwtAuthGuard)
@Controller('requests')
export class RequestsController {
  constructor(private readonly requestsService: RequestsService) {}

  @Get()
  async findAll(
    @CurrentUser() user: AuthUser,
    @Query('status') status?: string,
    @Query('type') type?: string,
    @Query('employeeId') employeeId?: string,
    @Query('page') page?: string,
    @Query('pageSize') pageSize?: string,
  ): Promise<ApiResponse<PaginatedResponse<LeaveRequestDto>>> {
    const isManagerOrAdmin = user.roles.some((r) =>
      ['admin', 'superadmin', 'hr', 'manager', 'supervisor'].includes(r),
    );

    // Admins/HR/Managers see all requests unless they filter by a specific employee.
    // Regular employees can only view their own requests.
    let targetEmployeeId: string | undefined;
    if (isManagerOrAdmin) {
      // If an explicit employeeId filter is provided, use it; otherwise no filter (see all)
      targetEmployeeId = employeeId || undefined;
    } else {
      // Non-admin always scoped to own employee ID
      targetEmployeeId = user.employeeId || undefined;
    }

    const data = await this.requestsService.findAll({
      employeeId: targetEmployeeId,
      status,
      type,
      page: page ? parseInt(page, 10) : 1,
      pageSize: pageSize ? parseInt(pageSize, 10) : 20,
    });

    return {
      success: true,
      data,
    };
  }

  @Get('leave-types')
  async getLeaveTypes(): Promise<ApiResponse<any[]>> {
    const data = await this.requestsService.getLeaveTypes();
    return {
      success: true,
      data,
    };
  }

  @Get('balances')
  async getBalances(@CurrentUser() user: AuthUser): Promise<ApiResponse<any[]>> {
    if (!user.employeeId) {
      throw new BadRequestException('User is not linked to an employee');
    }
    const data = await this.requestsService.getLeaveBalances(user.employeeId);
    return {
      success: true,
      data,
    };
  }

  @Post()
  async create(
    @CurrentUser() user: AuthUser,
    @Body() dto: CreateLeaveRequestDto,
  ): Promise<ApiResponse<LeaveRequestDto>> {
    if (!user.employeeId) {
      throw new BadRequestException('User is not linked to an employee');
    }
    const data = await this.requestsService.create(user.employeeId, dto);
    return {
      success: true,
      message: 'Request submitted successfully',
      data,
    };
  }

  @Post(':id/approve')
  async approve(
    @Param('id') id: string,
    @CurrentUser() user: AuthUser,
    @Body() body: { notes?: string },
  ): Promise<ApiResponse<LeaveRequestDto>> {
    const data = await this.requestsService.approve(id, user, body.notes);
    return {
      success: true,
      message: 'Request approved successfully',
      data,
    };
  }

  @Post(':id/reject')
  async reject(
    @Param('id') id: string,
    @CurrentUser() user: AuthUser,
    @Body() body: { notes?: string },
  ): Promise<ApiResponse<LeaveRequestDto>> {
    const data = await this.requestsService.reject(id, user, body.notes);
    return {
      success: true,
      message: 'Request rejected',
      data,
    };
  }
}
