import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CheckInRequestDto, CheckOutRequestDto, AttendanceRecordDto, PaginatedResponse } from '@absensi/types';

@Injectable()
export class AttendanceService {
  constructor(private readonly prisma: PrismaService) {}

  private getTodayDateString(): string {
    // Use Asia/Jakarta timezone
    const now = new Date();
    const jakarta = new Date(now.toLocaleString('en-US', { timeZone: 'Asia/Jakarta' }));
    const y = jakarta.getFullYear();
    const m = String(jakarta.getMonth() + 1).padStart(2, '0');
    const d = String(jakarta.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  }

  /**
   * Resolve employee's current effective shift.
   * Falls back to the default Regular Office shift (08:00–17:00, grace 10m).
   */
  private async resolveShift(employeeId: string): Promise<{
    shiftId: string | null;
    scheduleId: string | null;
    startTime: string;
    gracePeriodMinutes: number;
  }> {
    const today = this.getTodayDateString();

    // 1. Look for a schedule assignment valid today
    const assignment = await this.prisma.scheduleAssignment.findFirst({
      where: {
        employeeId,
        effectiveFrom: { lte: new Date(today) },
        OR: [{ effectiveUntil: null }, { effectiveUntil: { gte: new Date(today) } }],
      },
      orderBy: { effectiveFrom: 'desc' },
      include: {
        schedule: {
          include: {
            days: {
              include: { shift: true },
            },
          },
        },
      },
    });

    if (assignment?.schedule) {
      const dayOfWeek = new Date(today).getDay(); // 0=Sun … 6=Sat
      const scheduleDay = assignment.schedule.days.find((d) => d.dayOfWeek === dayOfWeek);
      if (scheduleDay?.shift) {
        return {
          shiftId: scheduleDay.shiftId,
          scheduleId: assignment.scheduleId,
          startTime: scheduleDay.shift.startTime,
          gracePeriodMinutes: scheduleDay.shift.gracePeriodMinutes,
        };
      }
    }

    // 2. Fallback: find a default shift in the DB
    const defaultShift = await this.prisma.shift.findFirst({
      where: { code: 'REG', isActive: true },
    });

    if (defaultShift) {
      return {
        shiftId: defaultShift.id,
        scheduleId: null,
        startTime: defaultShift.startTime,
        gracePeriodMinutes: defaultShift.gracePeriodMinutes,
      };
    }

    // 3. Hard fallback (should never happen after seed)
    return { shiftId: null, scheduleId: null, startTime: '08:00', gracePeriodMinutes: 10 };
  }

  /**
   * Calculate late minutes given actual check-in time and shift start.
   */
  private calculateLateMinutes(
    now: Date,
    startTime: string,
    gracePeriodMinutes: number,
  ): { lateMinutes: number; status: string } {
    const [startHour, startMin] = startTime.split(':').map(Number);

    // Use Jakarta timezone for the current time
    const jakartaNow = new Date(now.toLocaleString('en-US', { timeZone: 'Asia/Jakarta' }));
    const currentHour = jakartaNow.getHours();
    const currentMin = jakartaNow.getMinutes();

    const shiftStartTotal = startHour * 60 + startMin;
    const nowTotal = currentHour * 60 + currentMin;
    const diffMinutes = nowTotal - shiftStartTotal;

    if (diffMinutes <= gracePeriodMinutes) {
      return { lateMinutes: 0, status: 'PRESENT' };
    }

    return { lateMinutes: diffMinutes, status: 'LATE' };
  }

  async getTodayAttendance(employeeId: string): Promise<AttendanceRecordDto | null> {
    const today = this.getTodayDateString();
    const attendance = await this.prisma.attendance.findUnique({
      where: {
        employeeId_workDate: { employeeId, workDate: today },
      },
      include: {
        employee: { include: { department: true } },
        shift: true,
        officeLocation: true,
      },
    });

    if (!attendance) return null;
    return this.mapToDto(attendance);
  }

  /**
   * Admin: get all attendance records for today (with filters).
   */
  async getTodayAttendanceAll(params: {
    departmentId?: string;
    status?: string;
    page?: number;
    pageSize?: number;
  }): Promise<PaginatedResponse<AttendanceRecordDto>> {
    const today = this.getTodayDateString();
    const page = params.page || 1;
    const pageSize = params.pageSize || 50;
    const skip = (page - 1) * pageSize;

    const where: any = { workDate: today };
    if (params.status) where.status = params.status.toUpperCase();
    if (params.departmentId) {
      where.employee = { departmentId: params.departmentId };
    }

    const [total, items] = await Promise.all([
      this.prisma.attendance.count({ where }),
      this.prisma.attendance.findMany({
        where,
        skip,
        take: pageSize,
        orderBy: { checkInAt: 'asc' },
        include: {
          employee: { include: { department: true } },
          shift: true,
          officeLocation: true,
        },
      }),
    ]);

    const totalPages = Math.ceil(total / pageSize);
    return {
      items: items.map((a) => this.mapToDto(a)),
      total,
      page,
      pageSize,
      totalPages,
      hasNext: page < totalPages,
      hasPrev: page > 1,
    };
  }

  async checkIn(employeeId: string, dto: CheckInRequestDto): Promise<AttendanceRecordDto> {
    const today = this.getTodayDateString();
    const now = new Date();

    // 1. Verify employee exists and is active
    const employee = await this.prisma.employee.findUnique({
      where: { id: employeeId },
    });
    if (!employee) throw new NotFoundException('Employee not found');
    if (employee.status !== 'ACTIVE') {
      throw new BadRequestException('Employee account is not active');
    }

    // 2. Duplicate check-in guard
    const existing = await this.prisma.attendance.findUnique({
      where: { employeeId_workDate: { employeeId, workDate: today } },
    });
    if (existing?.checkInAt) {
      throw new BadRequestException('Anda sudah melakukan Check-In hari ini');
    }

    // 3. Resolve shift from DB (not hardcoded)
    const shiftInfo = await this.resolveShift(employeeId);

    // 4. Calculate late status using DB shift data
    const { lateMinutes, status } = this.calculateLateMinutes(
      now,
      shiftInfo.startTime,
      shiftInfo.gracePeriodMinutes,
    );

    // 5. Resolve office location if coordinates provided
    let officeLocationId: string | null = null;
    if (dto.coordinates?.latitude && dto.coordinates?.longitude) {
      const nearestOffice = await this.findNearestOffice(
        dto.coordinates.latitude,
        dto.coordinates.longitude,
      );
      if (nearestOffice) officeLocationId = nearestOffice.id;
    }

    // 6. Upsert attendance record (in case of partial existing record)
    const attendance = await this.prisma.attendance.upsert({
      where: { employeeId_workDate: { employeeId, workDate: today } },
      update: {
        checkInAt: now,
        checkInLatitude: dto.coordinates?.latitude,
        checkInLongitude: dto.coordinates?.longitude,
        checkInAccuracy: dto.coordinates?.accuracy,
        checkInSelfieUrl: dto.faceCapturedPhoto,
        checkInIp: dto.address,
        lateMinutes,
        status,
        shiftId: shiftInfo.shiftId,
        scheduleId: shiftInfo.scheduleId,
        officeLocationId,
        notes: dto.notes,
      },
      create: {
        employeeId,
        workDate: today,
        checkInAt: now,
        checkInLatitude: dto.coordinates?.latitude,
        checkInLongitude: dto.coordinates?.longitude,
        checkInAccuracy: dto.coordinates?.accuracy,
        checkInSelfieUrl: dto.faceCapturedPhoto,
        checkInIp: dto.address,
        lateMinutes,
        status,
        shiftId: shiftInfo.shiftId,
        scheduleId: shiftInfo.scheduleId,
        officeLocationId,
        notes: dto.notes,
      },
      include: {
        employee: { include: { department: true } },
        shift: true,
        officeLocation: true,
      },
    });

    // 7. Record attendance event for forensic trace
    await this.prisma.attendanceEvent.create({
      data: {
        attendanceId: attendance.id,
        eventType: 'CHECK_IN_COMPLETED',
        occurredAt: now,
        metadata: JSON.stringify({
          latitude: dto.coordinates?.latitude,
          longitude: dto.coordinates?.longitude,
          accuracy: dto.coordinates?.accuracy,
          lateMinutes,
          status,
          officeLocationId,
        }),
      },
    });

    return this.mapToDto(attendance);
  }

  async checkOut(employeeId: string, dto: CheckOutRequestDto): Promise<AttendanceRecordDto> {
    const today = this.getTodayDateString();
    const now = new Date();

    const existing = await this.prisma.attendance.findUnique({
      where: { employeeId_workDate: { employeeId, workDate: today } },
    });

    if (!existing || !existing.checkInAt) {
      throw new BadRequestException('Tidak dapat Check-Out: belum ada Check-In hari ini');
    }

    if (existing.checkOutAt) {
      throw new BadRequestException('Anda sudah melakukan Check-Out hari ini');
    }

    const durationMinutes = Math.floor(
      (now.getTime() - new Date(existing.checkInAt).getTime()) / (1000 * 60),
    );

    const attendance = await this.prisma.attendance.update({
      where: { id: existing.id },
      data: {
        checkOutAt: now,
        checkOutLatitude: dto.coordinates?.latitude,
        checkOutLongitude: dto.coordinates?.longitude,
        checkOutAccuracy: dto.coordinates?.accuracy,
        checkOutSelfieUrl: dto.faceCapturedPhoto,
        checkOutIp: dto.address,
        durationMinutes,
      },
      include: {
        employee: { include: { department: true } },
        shift: true,
        officeLocation: true,
      },
    });

    await this.prisma.attendanceEvent.create({
      data: {
        attendanceId: attendance.id,
        eventType: 'CHECK_OUT_COMPLETED',
        occurredAt: now,
        metadata: JSON.stringify({
          latitude: dto.coordinates?.latitude,
          longitude: dto.coordinates?.longitude,
          accuracy: dto.coordinates?.accuracy,
          durationMinutes,
        }),
      },
    });

    return this.mapToDto(attendance);
  }

  async getAttendanceHistory(
    employeeId?: string,
    startDate?: string,
    endDate?: string,
    status?: string,
    departmentId?: string,
    page = 1,
    pageSize = 20,
  ): Promise<PaginatedResponse<AttendanceRecordDto>> {
    const where: any = {};
    if (employeeId) where.employeeId = employeeId;
    if (status) where.status = status.toUpperCase();
    if (startDate && endDate) {
      where.workDate = { gte: startDate, lte: endDate };
    } else if (startDate) {
      where.workDate = { gte: startDate };
    } else if (endDate) {
      where.workDate = { lte: endDate };
    }
    if (departmentId) {
      where.employee = { departmentId };
    }

    const skip = (page - 1) * pageSize;
    const [total, items] = await Promise.all([
      this.prisma.attendance.count({ where }),
      this.prisma.attendance.findMany({
        where,
        skip,
        take: pageSize,
        orderBy: { workDate: 'desc' },
        include: {
          employee: { include: { department: true } },
          shift: true,
          officeLocation: true,
        },
      }),
    ]);

    const totalPages = Math.ceil(total / pageSize);
    return {
      items: items.map((item) => this.mapToDto(item)),
      total,
      page,
      pageSize,
      totalPages,
      hasNext: page < totalPages,
      hasPrev: page > 1,
    };
  }

  async bulkDeleteAttendance(ids: string[]): Promise<{ deleted: number }> {
    if (!ids || ids.length === 0) {
      throw new BadRequestException('No IDs provided');
    }

    // First delete related events to avoid FK constraint
    await this.prisma.attendanceEvent.deleteMany({
      where: { attendanceId: { in: ids } },
    });
    await this.prisma.faceVerification.deleteMany({
      where: { attendanceId: { in: ids } },
    });

    const result = await this.prisma.attendance.deleteMany({
      where: { id: { in: ids } },
    });

    return { deleted: result.count };
  }

  private async findNearestOffice(lat: number, lng: number) {
    const offices = await this.prisma.officeLocation.findMany({
      where: { isActive: true },
    });

    let nearest: (typeof offices)[0] | null = null;
    let minDist = Infinity;

    for (const office of offices) {
      const dist = this.haversineDistance(lat, lng, office.latitude, office.longitude);
      if (dist <= office.radiusMeters && dist < minDist) {
        minDist = dist;
        nearest = office;
      }
    }

    return nearest;
  }

  private haversineDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
    const R = 6371000; // Earth radius in meters
    const toRad = (x: number) => (x * Math.PI) / 180;
    const dLat = toRad(lat2 - lat1);
    const dLng = toRad(lng2 - lng1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
      Math.sin(dLng / 2) * Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  private mapToDto(attendance: any): AttendanceRecordDto {
    return {
      id: attendance.id,
      employeeId: attendance.employeeId,
      employeeName: attendance.employee?.name,
      employeeCode: attendance.employee?.employeeNumber,
      departmentName: attendance.employee?.department?.name,
      date: attendance.workDate,
      shiftId: attendance.shiftId,
      shiftName: attendance.shift?.name || 'Regular Office',
      scheduledIn: attendance.shift?.startTime || '08:00',
      scheduledOut: attendance.shift?.endTime || '17:00',
      checkIn: attendance.checkInAt ? new Date(attendance.checkInAt).toISOString() : undefined,
      checkOut: attendance.checkOutAt ? new Date(attendance.checkOutAt).toISOString() : undefined,
      checkInLat: attendance.checkInLatitude,
      checkInLng: attendance.checkInLongitude,
      checkOutLat: attendance.checkOutLatitude,
      checkOutLng: attendance.checkOutLongitude,
      checkInAddress: attendance.officeLocation?.name,
      lateMinutes: attendance.lateMinutes || 0,
      earlyMinutes: 0,
      workMinutes: attendance.durationMinutes || 0,
      status: (attendance.status?.toLowerCase() as any) || 'present',
      isOvertime: false,
      overtimeMinutes: 0,
      notes: attendance.notes,
    };
  }
}
