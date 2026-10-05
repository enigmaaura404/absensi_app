import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Patch,
  Body,
  Param,
  UseGuards,
  HttpCode,
  HttpStatus,
  ForbiddenException,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { AuthUser, ApiResponse } from '@absensi/types';
import { IntegrationsService, SaveProviderSettingsDto, ProviderStatus, TestConnectionResult } from './integrations.service';

/** Verify caller has the integration management permission */
function requireIntegrationPermission(user: AuthUser): void {
  const hasPermission =
    user.permissions.includes('system.integration.manage') ||
    user.roles.includes('superadmin');
  if (!hasPermission) {
    throw new ForbiddenException('Access denied: system.integration.manage permission required');
  }
}

@Controller('admin/integrations')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('superadmin')
export class IntegrationsController {
  constructor(private readonly integrationsService: IntegrationsService) {}

  // ── Providers ──────────────────────────────────────────────────────────────

  @Get('providers')
  async getAllProviders(
    @CurrentUser() user: AuthUser,
  ): Promise<ApiResponse<ProviderStatus[]>> {
    requireIntegrationPermission(user);
    const data = await this.integrationsService.getAllProviders();
    return { success: true, data };
  }

  @Get('providers/:type')
  async getProvider(
    @Param('type') type: string,
    @CurrentUser() user: AuthUser,
  ): Promise<ApiResponse<ProviderStatus>> {
    requireIntegrationPermission(user);
    const data = await this.integrationsService.getProvider(type.toUpperCase());
    return { success: true, data };
  }

  @Post('providers/:type/settings')
  @HttpCode(HttpStatus.OK)
  async saveSettings(
    @Param('type') type: string,
    @Body() body: { settings: { key: string; value: string }[] },
    @CurrentUser() user: AuthUser,
  ): Promise<ApiResponse<{ saved: number }>> {
    requireIntegrationPermission(user);
    const dto: SaveProviderSettingsDto = {
      type: type.toUpperCase(),
      settings: body.settings,
    };
    const data = await this.integrationsService.saveSettings(dto, user.id);
    return { success: true, message: 'Settings saved successfully', data };
  }

  @Post('providers/:type/test')
  @HttpCode(HttpStatus.OK)
  async testConnection(
    @Param('type') type: string,
    @CurrentUser() user: AuthUser,
  ): Promise<ApiResponse<TestConnectionResult>> {
    requireIntegrationPermission(user);
    const data = await this.integrationsService.testConnection(type.toUpperCase());
    return {
      success: data.ok,
      message: data.message,
      data,
    };
  }

  @Delete('providers/:type')
  @HttpCode(HttpStatus.OK)
  async disconnect(
    @Param('type') type: string,
    @CurrentUser() user: AuthUser,
  ): Promise<ApiResponse<null>> {
    requireIntegrationPermission(user);
    await this.integrationsService.disconnect(type.toUpperCase(), user.id);
    return { success: true, message: `${type} integration disconnected`, data: null };
  }

  // ── Notification Templates ─────────────────────────────────────────────────

  @Get('templates')
  async getTemplates(
    @CurrentUser() user: AuthUser,
  ): Promise<ApiResponse<unknown[]>> {
    requireIntegrationPermission(user);
    const data = await this.integrationsService.getTemplates();
    return { success: true, data };
  }

  @Put('templates/:event')
  async updateTemplate(
    @Param('event') event: string,
    @Body() body: { template: string; isActive: boolean },
    @CurrentUser() user: AuthUser,
  ): Promise<ApiResponse<unknown>> {
    requireIntegrationPermission(user);
    const data = await this.integrationsService.updateTemplate(
      event,
      body.template,
      body.isActive,
    );
    return { success: true, message: 'Template updated', data };
  }
}
