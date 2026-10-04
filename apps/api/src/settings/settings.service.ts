import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { SystemSettingDto } from '@absensi/types';

@Injectable()
export class SettingsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<SystemSettingDto[]> {
    const settings = await this.prisma.systemSetting.findMany({
      orderBy: { key: 'asc' },
    });

    return settings.map((s) => ({
      id: s.id,
      key: s.key,
      value: s.value,
      type: s.type,
      label: s.label,
    }));
  }

  async updateMany(updates: Record<string, any>, updatedBy?: string): Promise<SystemSettingDto[]> {
    const results: SystemSettingDto[] = [];

    for (const [key, val] of Object.entries(updates)) {
      const stringValue = typeof val === 'object' ? JSON.stringify(val) : String(val);
      const valType = typeof val === 'number' ? 'number' : typeof val === 'boolean' ? 'boolean' : 'string';

      const setting = await this.prisma.systemSetting.upsert({
        where: { key },
        create: {
          key,
          value: stringValue,
          type: valType,
          label: key,
          updatedBy,
        },
        update: {
          value: stringValue,
          updatedBy,
        },
      });

      results.push({
        id: setting.id,
        key: setting.key,
        value: setting.value,
        type: setting.type,
        label: setting.label,
      });
    }

    return results;
  }
}
