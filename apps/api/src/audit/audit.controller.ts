import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AuditService } from './audit.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { ApiResponse, AuditLogDto, PaginatedResponse, AuthUser } from '@absensi/types';

@UseGuards(JwtAuthGuard)
@Controller('audit')
export class AuditController {
  constructor(private readonly auditService: AuditService) {}

  @Get()
  async findAll(
    @Query('module') module?: string,
    @Query('action') action?: string,
    @Query('page') page?: string,
    @Query('pageSize') pageSize?: string,
  ): Promise<ApiResponse<PaginatedResponse<AuditLogDto>>> {
    const data = await this.auditService.findAll({
      module,
      action,
      page: page ? parseInt(page, 10) : 1,
      pageSize: pageSize ? parseInt(pageSize, 10) : 20,
    });
    return {
      success: true,
      data,
    };
  }

  @Post()
  async create(
    @CurrentUser() user: AuthUser,
    @Body() dto: { action: string; module: string; details?: string; targetId?: string },
  ): Promise<ApiResponse<AuditLogDto>> {
    const data = await this.auditService.create({
      actorId: user.id,
      actorName: user.employeeName || user.email,
      actorRole: user.roles[0] || 'employee',
      action: dto.action,
      module: dto.module,
      details: dto.details,
      targetId: dto.targetId,
      result: 'SUCCESS',
    });
    return {
      success: true,
      message: 'Audit log recorded',
      data,
    };
  }
}
