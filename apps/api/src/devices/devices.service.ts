import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { DeviceDto } from '@absensi/types';

@Injectable()
export class DevicesService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(employeeId?: string): Promise<DeviceDto[]> {
    const where: any = {};
    if (employeeId) {
      where.employeeId = employeeId;
    }

    const devices = await this.prisma.device.findMany({
      where,
      orderBy: { registeredAt: 'desc' },
      include: {
        employee: true,
      },
    });

    return devices.map((d) => ({
      id: d.id,
      employeeId: d.employeeId,
      employeeName: d.employee?.name,
      deviceIdentifier: d.deviceIdentifier,
      deviceModel: d.deviceModel,
      deviceType: d.deviceType,
      platform: d.platform,
      browser: d.browser,
      status: d.status,
      registeredAt: d.registeredAt.toISOString(),
      lastSeenAt: d.lastSeenAt ? d.lastSeenAt.toISOString() : null,
    }));
  }

  async updateStatus(id: string, status: string, approverId?: string): Promise<DeviceDto> {
    const updated = await this.prisma.device.update({
      where: { id },
      data: {
        status: status.toUpperCase(),
        ...(status.toUpperCase() === 'ACTIVE' && approverId
          ? { approvedAt: new Date(), approvedBy: approverId }
          : {}),
      },
      include: {
        employee: true,
      },
    });

    return {
      id: updated.id,
      employeeId: updated.employeeId,
      employeeName: updated.employee?.name,
      deviceIdentifier: updated.deviceIdentifier,
      deviceModel: updated.deviceModel,
      deviceType: updated.deviceType,
      platform: updated.platform,
      browser: updated.browser,
      status: updated.status,
      registeredAt: updated.registeredAt.toISOString(),
      lastSeenAt: updated.lastSeenAt ? updated.lastSeenAt.toISOString() : null,
    };
  }

  async delete(id: string): Promise<boolean> {
    await this.prisma.device.delete({ where: { id } });
    return true;
  }
}
