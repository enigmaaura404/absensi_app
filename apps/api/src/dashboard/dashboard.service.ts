import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { DashboardStatsDto } from '@absensi/types';

@Injectable()
export class DashboardService {
  constructor(private readonly prisma: PrismaService) {}

  private getTodayDateString(): string {
    const now = new Date();
    return now.toISOString().split('T')[0];
  }

  async getStats(): Promise<DashboardStatsDto> {
    const today = this.getTodayDateString();

    const [
      totalEmployees,
      todayAttendances,
      pendingRequests,
      departments,
    ] = await Promise.all([
      this.prisma.employee.count({ where: { status: 'ACTIVE' } }),
      this.prisma.attendance.findMany({
        where: { workDate: today },
      }),
      this.prisma.request.count({ where: { status: 'PENDING' } }),
      this.prisma.department.findMany({
        include: {
          employees: {
            where: { status: 'ACTIVE' },
            include: {
              attendances: {
                where: { workDate: today },
              },
            },
          },
        },
      }),
    ]);

    const presentToday = todayAttendances.filter(
      (a) => a.status === 'PRESENT' || a.status === 'present',
    ).length;
    const lateToday = todayAttendances.filter(
      (a) => a.status === 'LATE' || a.status === 'late',
    ).length;
    const onLeaveToday = todayAttendances.filter(
      (a) => ['LEAVE', 'leave', 'SICK', 'sick'].includes(a.status),
    ).length;
    const absentToday = Math.max(0, totalEmployees - (presentToday + lateToday + onLeaveToday));

    // Calculate last 7 days trend
    const weeklyTrend: { date: string; present: number; late: number; absent: number }[] = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];

      const records = await this.prisma.attendance.findMany({
        where: { workDate: dateStr },
      });

      const dayPresent = records.filter((r) => r.status === 'PRESENT' || r.status === 'present').length;
      const dayLate = records.filter((r) => r.status === 'LATE' || r.status === 'late').length;
      const dayAbsent = Math.max(0, totalEmployees - records.length);

      weeklyTrend.push({
        date: dateStr,
        present: dayPresent,
        late: dayLate,
        absent: dayAbsent,
      });
    }

    const departmentBreakdown = departments.map((dept) => {
      const deptEmpCount = dept.employees.length;
      const deptPresent = dept.employees.filter((e) =>
        e.attendances.some((a) => ['PRESENT', 'present', 'LATE', 'late'].includes(a.status)),
      ).length;

      const attendanceRate = deptEmpCount > 0 ? Math.round((deptPresent / deptEmpCount) * 100) : 0;

      return {
        departmentId: dept.id,
        departmentName: dept.name,
        attendanceRate,
      };
    });

    return {
      totalEmployees,
      presentToday,
      lateToday,
      onLeaveToday,
      absentToday,
      pendingRequests,
      weeklyTrend,
      departmentBreakdown,
    };
  }
}
