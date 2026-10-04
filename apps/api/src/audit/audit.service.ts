import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AuditLogDto, PaginatedResponse } from '@absensi/types';

@Injectable()
export class AuditService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(params: {
    module?: string;
    action?: string;
    page?: number;
    pageSize?: number;
  }): Promise<PaginatedResponse<AuditLogDto>> {
    const page = params.page || 1;
    const pageSize = params.pageSize || 20;
    const skip = (page - 1) * pageSize;

    const where: any = {};
    if (params.module) where.module = params.module.toUpperCase();
    if (params.action) where.action = params.action.toUpperCase();

    const [total, logs] = await Promise.all([
      this.prisma.auditLog.count({ where }),
      this.prisma.auditLog.findMany({
        where,
        skip,
        take: pageSize,
        orderBy: { createdAt: 'desc' },
      }),
    ]);

    const totalPages = Math.ceil(total / pageSize);

    return {
      items: logs.map((log) => ({
        id: log.id,
        actorId: log.actorId,
        actorName: log.actorName,
        actorRole: log.actorRole,
        action: log.action,
        module: log.module,
        targetId: log.targetId,
        targetType: log.targetType,
        ipAddress: log.ipAddress,
        result: log.result,
        details: log.details,
        createdAt: log.createdAt.toISOString(),
      })),
      total,
      page,
      pageSize,
      totalPages,
      hasNext: page < totalPages,
      hasPrev: page > 1,
    };
  }

  async create(data: {
    actorId?: string;
    actorName?: string;
    actorRole?: string;
    action: string;
    module: string;
    targetId?: string;
    targetType?: string;
    ipAddress?: string;
    result: string;
    details?: string;
  }): Promise<AuditLogDto> {
    const log = await this.prisma.auditLog.create({
      data: {
        actorId: data.actorId,
        actorName: data.actorName,
        actorRole: data.actorRole,
        action: data.action.toUpperCase(),
        module: data.module.toUpperCase(),
        targetId: data.targetId,
        targetType: data.targetType,
        ipAddress: data.ipAddress,
        result: data.result.toUpperCase(),
        details: data.details,
      },
    });

    return {
      id: log.id,
      actorId: log.actorId,
      actorName: log.actorName,
      actorRole: log.actorRole,
      action: log.action,
      module: log.module,
      targetId: log.targetId,
      targetType: log.targetType,
      ipAddress: log.ipAddress,
      result: log.result,
      details: log.details,
      createdAt: log.createdAt.toISOString(),
    };
  }
}
