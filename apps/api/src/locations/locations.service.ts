import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { OfficeLocationDto, CreateOfficeLocationDto } from '@absensi/types';

@Injectable()
export class LocationsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<OfficeLocationDto[]> {
    const locations = await this.prisma.officeLocation.findMany({
      where: { isActive: true },
      orderBy: { name: 'asc' },
    });

    return locations.map((loc) => ({
      id: loc.id,
      name: loc.name,
      address: loc.address,
      city: loc.city,
      latitude: loc.latitude,
      longitude: loc.longitude,
      radiusMeters: loc.radiusMeters,
      accuracyLimitMeters: loc.accuracyLimitMeters,
      isActive: loc.isActive,
    }));
  }

  async create(dto: CreateOfficeLocationDto): Promise<OfficeLocationDto> {
    const created = await this.prisma.officeLocation.create({
      data: {
        name: dto.name,
        address: dto.address,
        city: dto.city,
        latitude: dto.latitude,
        longitude: dto.longitude,
        radiusMeters: dto.radiusMeters || 100,
        accuracyLimitMeters: dto.accuracyLimitMeters || 50,
        isActive: true,
      },
    });

    return {
      id: created.id,
      name: created.name,
      address: created.address,
      city: created.city,
      latitude: created.latitude,
      longitude: created.longitude,
      radiusMeters: created.radiusMeters,
      accuracyLimitMeters: created.accuracyLimitMeters,
      isActive: created.isActive,
    };
  }

  async update(id: string, dto: Partial<CreateOfficeLocationDto>): Promise<OfficeLocationDto> {
    const updated = await this.prisma.officeLocation.update({
      where: { id },
      data: {
        ...(dto.name && { name: dto.name }),
        ...(dto.address !== undefined && { address: dto.address }),
        ...(dto.city !== undefined && { city: dto.city }),
        ...(dto.latitude !== undefined && { latitude: dto.latitude }),
        ...(dto.longitude !== undefined && { longitude: dto.longitude }),
        ...(dto.radiusMeters !== undefined && { radiusMeters: dto.radiusMeters }),
        ...(dto.accuracyLimitMeters !== undefined && { accuracyLimitMeters: dto.accuracyLimitMeters }),
      },
    });

    return {
      id: updated.id,
      name: updated.name,
      address: updated.address,
      city: updated.city,
      latitude: updated.latitude,
      longitude: updated.longitude,
      radiusMeters: updated.radiusMeters,
      accuracyLimitMeters: updated.accuracyLimitMeters,
      isActive: updated.isActive,
    };
  }

  async delete(id: string): Promise<boolean> {
    await this.prisma.officeLocation.delete({ where: { id } }).catch(async () => {
      await this.prisma.officeLocation.update({
        where: { id },
        data: { isActive: false },
      });
    });
    return true;
  }
}
