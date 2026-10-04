/**
 * Reporting & Analytics Utilities
 *
 * Derives department-level attendance statistics from real AttendanceRecord data.
 * Replaces the hardcoded mock arrays previously in LaporanPage.
 */

import { AttendanceRecord, User } from '../types';

export interface DepartmentAttendanceStat {
  name: string;
  /** Attendance rate in % (present + late / total expected working days) */
  hadir: number;
  /** Late rate in % (late / present+late) */
  late: number;
  /** Leave/absence rate in % */
  leave: number;
  /** Total headcount in this department */
  total: number;
  /** Raw counts */
  counts: {
    presentCount: number;
    lateCount: number;
    leaveCount: number;
    absentCount: number;
    totalRecords: number;
  };
}

export interface AttendanceSummary {
  totalRecords: number;
  presentCount: number;
  lateCount: number;
  leaveCount: number;
  absentCount: number;
  /** Attendance rate %, rounded 1 dp */
  attendanceRate: number;
  /** Late rate %, rounded 1 dp */
  lateRate: number;
  /** Average duration in minutes across all completed (checked-out) records */
  avgDurationMinutes: number;
}

/**
 * Computes an overall summary from a set of AttendanceRecord.
 */
export function computeAttendanceSummary(records: AttendanceRecord[]): AttendanceSummary {
  const totalRecords = records.length;
  if (totalRecords === 0) {
    return {
      totalRecords: 0,
      presentCount: 0,
      lateCount: 0,
      leaveCount: 0,
      absentCount: 0,
      attendanceRate: 0,
      lateRate: 0,
      avgDurationMinutes: 0,
    };
  }

  const presentCount = records.filter((r) => r.status === 'Hadir').length;
  const lateCount = records.filter((r) => r.status === 'Terlambat').length;
  const leaveCount = records.filter(
    (r) => r.status === 'Cuti' || r.status === 'Izin' || r.status === 'Sakit' || r.status === 'Dinas'
  ).length;
  const absentCount = records.filter((r) => r.status === 'Belum Check-In').length;

  const attended = presentCount + lateCount;
  const attendanceRate = parseFloat(((attended / totalRecords) * 100).toFixed(1));
  const lateRate =
    attended > 0 ? parseFloat(((lateCount / attended) * 100).toFixed(1)) : 0;

  const completedRecords = records.filter((r) => r.durationMinutes != null && r.durationMinutes > 0);
  const avgDurationMinutes =
    completedRecords.length > 0
      ? Math.round(
          completedRecords.reduce((sum, r) => sum + (r.durationMinutes ?? 0), 0) /
            completedRecords.length
        )
      : 0;

  return {
    totalRecords,
    presentCount,
    lateCount,
    leaveCount,
    absentCount,
    attendanceRate,
    lateRate,
    avgDurationMinutes,
  };
}

/**
 * Computes per-department attendance statistics from attendance records and employee roster.
 * 
 * @param records   Attendance records (optionally pre-filtered for a period)
 * @param employees Employee roster used to determine department headcount
 */
export function computeDepartmentStats(
  records: AttendanceRecord[],
  employees: User[]
): DepartmentAttendanceStat[] {
  // Build department → headcount map from employee roster
  const deptHeadcount: Record<string, number> = {};
  for (const emp of employees) {
    if (emp.status !== 'Inactive') {
      deptHeadcount[emp.department] = (deptHeadcount[emp.department] ?? 0) + 1;
    }
  }

  // Build department → record list map from attendance records
  const deptRecords: Record<string, AttendanceRecord[]> = {};
  for (const rec of records) {
    if (!deptRecords[rec.department]) deptRecords[rec.department] = [];
    deptRecords[rec.department].push(rec);
  }

  const allDepts = new Set([
    ...Object.keys(deptHeadcount),
    ...Object.keys(deptRecords),
  ]);

  return Array.from(allDepts)
    .sort()
    .map((dept) => {
      const recs = deptRecords[dept] ?? [];
      const total = deptHeadcount[dept] ?? 0;
      const totalRecords = recs.length;

      const presentCount = recs.filter((r) => r.status === 'Hadir').length;
      const lateCount = recs.filter((r) => r.status === 'Terlambat').length;
      const leaveCount = recs.filter(
        (r) =>
          r.status === 'Cuti' ||
          r.status === 'Izin' ||
          r.status === 'Sakit' ||
          r.status === 'Dinas'
      ).length;
      const absentCount = recs.filter((r) => r.status === 'Belum Check-In').length;

      const attended = presentCount + lateCount;
      // Attendance rate: % of days where employee actually showed up
      const hadir =
        totalRecords > 0
          ? Math.round((attended / totalRecords) * 100)
          : 100; // no data → optimistic default

      // Late rate: % of attendances that were late
      const late = attended > 0 ? Math.round((lateCount / attended) * 100) : 0;

      // Leave rate: % of total record days that were leave/absent
      const leave =
        totalRecords > 0 ? Math.round(((leaveCount + absentCount) / totalRecords) * 100) : 0;

      return {
        name: dept,
        hadir,
        late,
        leave,
        total,
        counts: {
          presentCount,
          lateCount,
          leaveCount,
          absentCount,
          totalRecords,
        },
      };
    });
}
