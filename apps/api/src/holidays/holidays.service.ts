import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { HolidayDto, CreateHolidayDto } from '@absensi/types';

@Injectable()
export class HolidaysService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<HolidayDto[]> {
    const holidays = await this.prisma.holiday.findMany({
      where: { isActive: true },
      orderBy: { date: 'asc' },
    });

    return holidays.map((h) => ({
      id: h.id,
      name: h.name,
      date: h.date,
      type: h.type,
      source: h.source,
      description: h.description,
      isActive: h.isActive,
    }));
  }

  async create(dto: CreateHolidayDto): Promise<HolidayDto> {
    const created = await this.prisma.holiday.upsert({
      where: {
        date_type: {
          date: dto.date,
          type: dto.type.toUpperCase(),
        },
      },
      create: {
        name: dto.name,
        date: dto.date,
        type: dto.type.toUpperCase(),
        description: dto.description,
        isActive: true,
      },
      update: {
        name: dto.name,
        description: dto.description,
        isActive: true,
      },
    });

    return {
      id: created.id,
      name: created.name,
      date: created.date,
      type: created.type,
      source: created.source,
      description: created.description,
      isActive: created.isActive,
    };
  }

  async delete(id: string): Promise<boolean> {
    await this.prisma.holiday.delete({ where: { id } }).catch(async () => {
      await this.prisma.holiday.update({
        where: { id },
        data: { isActive: false },
      });
    });
    return true;
  }
}
