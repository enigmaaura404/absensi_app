import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

export interface NotificationDto {
  id: string;
  title: string;
  message: string;
  category: string;
  isRead: boolean;
  createdAt: string;
}

@Injectable()
export class NotificationsService {
  constructor(private readonly prisma: PrismaService) {}

  async getForUser(userId: string, page = 1, pageSize = 20) {
    const skip = (page - 1) * pageSize;
    const [total, items] = await Promise.all([
      this.prisma.notification.count({ where: { userId } }),
      this.prisma.notification.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        skip,
        take: pageSize,
      }),
    ]);
    const totalPages = Math.ceil(total / pageSize);
    return {
      items: items.map(this.mapToDto),
      total,
      page,
      pageSize,
      totalPages,
      hasNext: page < totalPages,
      hasPrev: page > 1,
      unreadCount: items.filter((n) => !n.isRead).length,
    };
  }

  async markAsRead(id: string, userId: string) {
    const notif = await this.prisma.notification.updateMany({
      where: { id, userId },
      data: { isRead: true },
    });
    return notif;
  }

  async markAllAsRead(userId: string) {
    const result = await this.prisma.notification.updateMany({
      where: { userId, isRead: false },
      data: { isRead: true },
    });
    return { updated: result.count };
  }

  async create(data: {
    userId: string;
    title: string;
    message: string;
    category: string;
    metadata?: any;
  }) {
    const notif = await this.prisma.notification.create({
      data: {
        userId: data.userId,
        title: data.title,
        message: data.message,
        category: data.category,
        metadata: data.metadata ? JSON.stringify(data.metadata) : undefined,
      },
    });
    return this.mapToDto(notif);
  }

  private mapToDto(n: any): NotificationDto {
    return {
      id: n.id,
      title: n.title,
      message: n.message,
      category: n.category,
      isRead: n.isRead,
      createdAt: n.createdAt instanceof Date ? n.createdAt.toISOString() : n.createdAt,
    };
  }
}
