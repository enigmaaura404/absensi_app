import {
  Injectable,
  Logger,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { EncryptionService } from './encryption.service';
import { TelegramService } from './telegram/telegram.service';
import { GoogleDriveService } from './google-drive/google-drive.service';
import { GoogleSheetsService } from './google-sheets/google-sheets.service';

export interface ProviderStatus {
  id: string;
  name: string;
  type: string;
  status: string;
  configuredKeys: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface SaveSettingDto {
  key: string;
  value: string;
}

export interface SaveProviderSettingsDto {
  type: string;
  settings: SaveSettingDto[];
}

export interface TestConnectionResult {
  ok: boolean;
  message: string;
  details?: Record<string, unknown>;
}

@Injectable()
export class IntegrationsService {
  private readonly logger = new Logger(IntegrationsService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly encryption: EncryptionService,
    private readonly telegram: TelegramService,
    private readonly drive: GoogleDriveService,
    private readonly sheets: GoogleSheetsService,
  ) {}

  /** List all integration providers with their status */
  async getAllProviders(): Promise<ProviderStatus[]> {
    const providers = await this.prisma.integrationProvider.findMany({
      include: { settings: { select: { key: true } } },
      orderBy: { name: 'asc' },
    });

    return providers.map((p) => ({
      id: p.id,
      name: p.name,
      type: p.type,
      status: p.status,
      configuredKeys: p.settings.map((s) => s.key),
      createdAt: p.createdAt,
      updatedAt: p.updatedAt,
    }));
  }

  /** Get one provider by type */
  async getProvider(type: string): Promise<ProviderStatus> {
    const provider = await this.prisma.integrationProvider.findUnique({
      where: { type },
      include: { settings: { select: { key: true } } },
    });
    if (!provider) throw new NotFoundException(`Integration provider ${type} not found`);
    return {
      id: provider.id,
      name: provider.name,
      type: provider.type,
      status: provider.status,
      configuredKeys: provider.settings.map((s) => s.key),
      createdAt: provider.createdAt,
      updatedAt: provider.updatedAt,
    };
  }

  /** Save (encrypt and upsert) settings for a provider */
  async saveSettings(
    dto: SaveProviderSettingsDto,
    actorId: string,
  ): Promise<{ saved: number }> {
    const provider = await this.prisma.integrationProvider.findUnique({
      where: { type: dto.type },
    });
    if (!provider) throw new NotFoundException(`Provider ${dto.type} not found`);

    for (const s of dto.settings) {
      const encryptedValue = this.encryption.encrypt(s.value);
      await this.prisma.systemIntegrationSetting.upsert({
        where: { providerId_key: { providerId: provider.id, key: s.key } },
        update: { encryptedValue, updatedBy: actorId },
        create: {
          providerId: provider.id,
          key: s.key,
          encryptedValue,
          createdBy: actorId,
          updatedBy: actorId,
        },
      });
    }

    return { saved: dto.settings.length };
  }

  /** Decrypt a single setting value (never expose to client — backend only) */
  async getDecryptedSetting(type: string, key: string): Promise<string | null> {
    const provider = await this.prisma.integrationProvider.findUnique({
      where: { type },
    });
    if (!provider) return null;

    const setting = await this.prisma.systemIntegrationSetting.findUnique({
      where: { providerId_key: { providerId: provider.id, key } },
    });
    if (!setting) return null;

    return this.encryption.safeDecrypt(setting.encryptedValue);
  }

  /** Get all decrypted settings for a provider (backend only, never expose keys to client) */
  private async getAllDecryptedSettings(type: string): Promise<Record<string, string>> {
    const provider = await this.prisma.integrationProvider.findUnique({
      where: { type },
      include: { settings: true },
    });
    if (!provider) return {};

    const result: Record<string, string> = {};
    for (const s of provider.settings) {
      const val = this.encryption.safeDecrypt(s.encryptedValue);
      if (val !== null) result[s.key] = val;
    }
    return result;
  }

  /** Test connection for a given integration type */
  async testConnection(type: string): Promise<TestConnectionResult> {
    const settings = await this.getAllDecryptedSettings(type);

    try {
      switch (type) {
        case 'TELEGRAM': {
          const token = settings['BOT_TOKEN'];
          if (!token) return { ok: false, message: 'BOT_TOKEN not configured' };

          const info = await this.telegram.getBotInfo(token);
          if (info.ok) {
            await this.prisma.integrationProvider.update({
              where: { type },
              data: { status: 'CONNECTED' },
            });
            return {
              ok: true,
              message: `Connected as @${info.username}`,
              details: { username: info.username, firstName: info.firstName },
            };
          } else {
            await this.prisma.integrationProvider.update({
              where: { type },
              data: { status: 'ERROR' },
            });
            return { ok: false, message: info.error ?? 'Bot verification failed' };
          }
        }

        case 'GOOGLE_DRIVE': {
          const clientId = settings['CLIENT_ID'];
          const clientSecret = settings['CLIENT_SECRET'];
          const refreshToken = settings['REFRESH_TOKEN'];
          const folderId = settings['DRIVE_FOLDER_ID'];

          if (!clientId || !clientSecret || !refreshToken) {
            return { ok: false, message: 'CLIENT_ID, CLIENT_SECRET, REFRESH_TOKEN are required' };
          }

          const result = await this.drive.testConnection({
            clientId,
            clientSecret,
            refreshToken,
            folderId,
          });

          await this.prisma.integrationProvider.update({
            where: { type },
            data: { status: result.ok ? 'CONNECTED' : 'ERROR' },
          });

          return {
            ok: result.ok,
            message: result.ok
              ? `Connected. Folder: ${result.folderName ?? 'root'}`
              : result.error ?? 'Connection failed',
          };
        }

        case 'GOOGLE_SHEETS': {
          const clientId = settings['CLIENT_ID'];
          const clientSecret = settings['CLIENT_SECRET'];
          const refreshToken = settings['REFRESH_TOKEN'];
          const spreadsheetId = settings['SHEET_ID'];

          if (!clientId || !clientSecret || !refreshToken || !spreadsheetId) {
            return {
              ok: false,
              message: 'CLIENT_ID, CLIENT_SECRET, REFRESH_TOKEN, SHEET_ID are required',
            };
          }

          const result = await this.sheets.testConnection({
            clientId,
            clientSecret,
            refreshToken,
            spreadsheetId,
          });

          await this.prisma.integrationProvider.update({
            where: { type },
            data: { status: result.ok ? 'CONNECTED' : 'ERROR' },
          });

          return {
            ok: result.ok,
            message: result.ok
              ? `Connected. Sheet: ${result.spreadsheetTitle ?? spreadsheetId}`
              : result.error ?? 'Connection failed',
          };
        }

        default:
          return { ok: false, message: `Unknown integration type: ${type}` };
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      this.logger.error(`Test connection error for ${type}: ${msg}`);
      await this.prisma.integrationProvider.update({
        where: { type },
        data: { status: 'ERROR' },
      });
      return { ok: false, message: msg };
    }
  }

  /** Disconnect / reset provider status and remove saved settings */
  async disconnect(type: string, actorId: string): Promise<void> {
    const provider = await this.prisma.integrationProvider.findUnique({
      where: { type },
    });
    if (!provider) throw new NotFoundException(`Provider ${type} not found`);

    await this.prisma.systemIntegrationSetting.deleteMany({
      where: { providerId: provider.id },
    });
    await this.prisma.integrationProvider.update({
      where: { type },
      data: { status: 'DISCONNECTED' },
    });

    this.logger.log(`Integration ${type} disconnected by user ${actorId}`);
  }

  /** Get notification templates */
  async getTemplates() {
    return this.prisma.notificationTemplate.findMany({
      orderBy: { event: 'asc' },
    });
  }

  /** Update a notification template */
  async updateTemplate(event: string, template: string, isActive: boolean) {
    return this.prisma.notificationTemplate.upsert({
      where: { event },
      update: { template, isActive },
      create: { event, template, isActive },
    });
  }
}
