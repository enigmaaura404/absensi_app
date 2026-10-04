import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { LocationsService } from './locations.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApiResponse, OfficeLocationDto, CreateOfficeLocationDto } from '@absensi/types';

@UseGuards(JwtAuthGuard)
@Controller('locations')
export class LocationsController {
  constructor(private readonly locationsService: LocationsService) {}

  @Get()
  async findAll(): Promise<ApiResponse<OfficeLocationDto[]>> {
    const data = await this.locationsService.findAll();
    return {
      success: true,
      data,
    };
  }

  @Post()
  async create(@Body() dto: CreateOfficeLocationDto): Promise<ApiResponse<OfficeLocationDto>> {
    const data = await this.locationsService.create(dto);
    return {
      success: true,
      message: 'Office location created successfully',
      data,
    };
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() dto: Partial<CreateOfficeLocationDto>,
  ): Promise<ApiResponse<OfficeLocationDto>> {
    const data = await this.locationsService.update(id, dto);
    return {
      success: true,
      message: 'Office location updated successfully',
      data,
    };
  }

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<ApiResponse<{ deleted: boolean }>> {
    await this.locationsService.delete(id);
    return {
      success: true,
      message: 'Office location deleted successfully',
      data: { deleted: true },
    };
  }
}
