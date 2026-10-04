import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { HolidaysService } from './holidays.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApiResponse, HolidayDto, CreateHolidayDto } from '@absensi/types';

@UseGuards(JwtAuthGuard)
@Controller('holidays')
export class HolidaysController {
  constructor(private readonly holidaysService: HolidaysService) {}

  @Get()
  async findAll(): Promise<ApiResponse<HolidayDto[]>> {
    const data = await this.holidaysService.findAll();
    return {
      success: true,
      data,
    };
  }

  @Post()
  async create(@Body() dto: CreateHolidayDto): Promise<ApiResponse<HolidayDto>> {
    const data = await this.holidaysService.create(dto);
    return {
      success: true,
      message: 'Holiday created successfully',
      data,
    };
  }

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<ApiResponse<{ deleted: boolean }>> {
    await this.holidaysService.delete(id);
    return {
      success: true,
      message: 'Holiday deleted successfully',
      data: { deleted: true },
    };
  }
}
