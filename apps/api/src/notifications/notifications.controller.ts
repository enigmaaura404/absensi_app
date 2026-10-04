import {
  Controller,
  Get,
  Patch,
  Post,
  Param,
  Body,
  Query,
  UseGuards,
} from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { AuthUser, ApiResponse } from '@absensi/types';

@UseGuards(JwtAuthGuard)
@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Get()
  async getMyNotifications(
    @CurrentUser() user: AuthUser,
    @Query('page') page?: string,
    @Query('pageSize') pageSize?: string,
  ): Promise<ApiResponse<any>> {
    const data = await this.notificationsService.getForUser(
      user.id,
      page ? parseInt(page, 10) : 1,
      pageSize ? parseInt(pageSize, 10) : 20,
    );
    return { success: true, data };
  }

  @Patch(':id/read')
  async markAsRead(
    @CurrentUser() user: AuthUser,
    @Param('id') id: string,
  ): Promise<ApiResponse<any>> {
    await this.notificationsService.markAsRead(id, user.id);
    return { success: true, message: 'Notifikasi ditandai sudah dibaca' };
  }

  @Post('mark-all-read')
  async markAllAsRead(@CurrentUser() user: AuthUser): Promise<ApiResponse<any>> {
    const result = await this.notificationsService.markAllAsRead(user.id);
    return {
      success: true,
      message: `${result.updated} notifikasi ditandai sudah dibaca`,
      data: result,
    };
  }
}
