import { Controller, Get, Post, Put, Delete, Param, Query, Body, UseGuards } from '@nestjs/common';
import { EmployeesService } from './employees.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApiResponse, EmployeeProfileDto, PaginatedResponse } from '@absensi/types';

@UseGuards(JwtAuthGuard)
@Controller('employees')
export class EmployeesController {
  constructor(private readonly employeesService: EmployeesService) {}

  @Get()
  async findAll(
    @Query('search') search?: string,
    @Query('departmentId') departmentId?: string,
    @Query('status') status?: string,
    @Query('page') page?: string,
    @Query('pageSize') pageSize?: string,
  ): Promise<ApiResponse<PaginatedResponse<EmployeeProfileDto>>> {
    const data = await this.employeesService.findAll({
      search,
      departmentId,
      status,
      page: page ? parseInt(page, 10) : 1,
      pageSize: pageSize ? parseInt(pageSize, 10) : 20,
    });
    return {
      success: true,
      data,
    };
  }

  @Post()
  async create(@Body() dto: any): Promise<ApiResponse<EmployeeProfileDto>> {
    const data = await this.employeesService.create(dto);
    return {
      success: true,
      message: 'Employee registered successfully',
      data,
    };
  }

  @Get('departments')
  async getDepartments(): Promise<ApiResponse<any[]>> {
    const data = await this.employeesService.getDepartments();
    return {
      success: true,
      data,
    };
  }

  @Get('positions')
  async getPositions(): Promise<ApiResponse<any[]>> {
    const data = await this.employeesService.getPositions();
    return {
      success: true,
      data,
    };
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<ApiResponse<EmployeeProfileDto>> {
    const data = await this.employeesService.findOne(id);
    return {
      success: true,
      data,
    };
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() dto: any,
  ): Promise<ApiResponse<EmployeeProfileDto>> {
    const data = await this.employeesService.update(id, dto);
    return {
      success: true,
      message: 'Employee updated successfully',
      data,
    };
  }

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<ApiResponse<{ deleted: boolean }>> {
    await this.employeesService.delete(id);
    return {
      success: true,
      message: 'Employee deactivated successfully',
      data: { deleted: true },
    };
  }
}
