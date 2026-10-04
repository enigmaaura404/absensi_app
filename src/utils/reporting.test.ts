import { describe, it, expect } from 'vitest';
import {
  computeAttendanceSummary,
  computeDepartmentStats,
} from './reporting';
import { AttendanceRecord, User } from '../types';

describe('Reporting & Analytics Utilities', () => {
  const mockEmployees: User[] = [
    {
      id: 'u1',
      employeeId: 'EMP-001',
      name: 'Budi Santoso',
      email: 'budi@test.com',
      phone: '081234567890',
      role: 'Employee',
      department: 'Technology',
      position: 'Developer',
      joinDate: '2024-01-01',
      avatar: '',
      status: 'Active',
      faceVerified: true,
      deviceVerified: true,
      leaveBalance: { total: 12, used: 2, pending: 0, remaining: 10 },
    },
    {
      id: 'u2',
      employeeId: 'EMP-002',
      name: 'Dewi Lestari',
      email: 'dewi@test.com',
      phone: '081234567891',
      role: 'Employee',
      department: 'Technology',
      position: 'QA Engineer',
      joinDate: '2024-02-01',
      avatar: '',
      status: 'Active',
      faceVerified: true,
      deviceVerified: true,
      leaveBalance: { total: 12, used: 0, pending: 0, remaining: 12 },
    },
    {
      id: 'u3',
      employeeId: 'EMP-003',
      name: 'Rudi Hartono',
      email: 'rudi@test.com',
      phone: '081234567892',
      role: 'Employee',
      department: 'Finance',
      position: 'Accountant',
      joinDate: '2024-03-01',
      avatar: '',
      status: 'Active',
      faceVerified: true,
      deviceVerified: true,
      leaveBalance: { total: 12, used: 1, pending: 0, remaining: 11 },
    },
  ];

  const mockRecords: AttendanceRecord[] = [
    {
      id: 'rec-1',
      employeeId: 'EMP-001',
      employeeName: 'Budi Santoso',
      department: 'Technology',
      date: '2026-10-01',
      shiftId: 's1',
      checkInTime: '07:55',
      checkOutTime: '17:05',
      status: 'Hadir',
      duration: '9j 10m',
      durationMinutes: 550,
      lateMinutes: 0,
      location: 'HQ Office',
      coordinates: '-6.2, 106.8',
      device: 'Phone A',
      ip: '192.168.1.1',
      selfieUrl: '',
    },
    {
      id: 'rec-2',
      employeeId: 'EMP-002',
      employeeName: 'Dewi Lestari',
      department: 'Technology',
      date: '2026-10-01',
      shiftId: 's1',
      checkInTime: '08:15',
      checkOutTime: '17:15',
      status: 'Terlambat',
      duration: '9j 0m',
      durationMinutes: 540,
      lateMinutes: 15,
      location: 'HQ Office',
      coordinates: '-6.2, 106.8',
      device: 'Phone B',
      ip: '192.168.1.2',
      selfieUrl: '',
    },
    {
      id: 'rec-3',
      employeeId: 'EMP-003',
      employeeName: 'Rudi Hartono',
      department: 'Finance',
      date: '2026-10-01',
      shiftId: 's1',
      checkInTime: null,
      checkOutTime: null,
      status: 'Cuti',
      duration: null,
      lateMinutes: 0,
      location: 'Remote',
      coordinates: '-6.2, 106.8',
      device: 'Web',
      ip: '192.168.1.3',
      selfieUrl: '',
    },
    {
      id: 'rec-4',
      employeeId: 'EMP-004',
      employeeName: 'Andi Saputra',
      department: 'Operations',
      date: '2026-10-01',
      shiftId: 's1',
      checkInTime: null,
      checkOutTime: null,
      status: 'Belum Check-In',
      duration: null,
      lateMinutes: 0,
      location: 'Office',
      coordinates: '-6.2, 106.8',
      device: 'Web',
      ip: '192.168.1.4',
      selfieUrl: '',
    },
  ];

  describe('computeAttendanceSummary', () => {
    it('returns empty zeroed summary when given empty records', () => {
      const summary = computeAttendanceSummary([]);
      expect(summary.totalRecords).toBe(0);
      expect(summary.presentCount).toBe(0);
      expect(summary.attendanceRate).toBe(0);
      expect(summary.lateRate).toBe(0);
      expect(summary.avgDurationMinutes).toBe(0);
    });

    it('correctly aggregates counts and rates from records', () => {
      const summary = computeAttendanceSummary(mockRecords);
      expect(summary.totalRecords).toBe(4);
      expect(summary.presentCount).toBe(1);
      expect(summary.lateCount).toBe(1);
      expect(summary.leaveCount).toBe(1);
      expect(summary.absentCount).toBe(1);

      // Attended = Hadir (1) + Terlambat (1) = 2 out of 4 -> 50.0%
      expect(summary.attendanceRate).toBe(50.0);

      // Late rate = 1 late out of 2 attended -> 50.0%
      expect(summary.lateRate).toBe(50.0);

      // Completed records: 550 + 540 = 1090 / 2 = 545 minutes
      expect(summary.avgDurationMinutes).toBe(545);
    });
  });

  describe('computeDepartmentStats', () => {
    it('groups statistics by department and incorporates employee headcount', () => {
      const deptStats = computeDepartmentStats(mockRecords, mockEmployees);
      expect(deptStats.length).toBeGreaterThan(0);

      const tech = deptStats.find((d) => d.name === 'Technology');
      expect(tech).toBeDefined();
      expect(tech?.total).toBe(2); // 2 employees in Technology roster
      expect(tech?.counts.presentCount).toBe(1);
      expect(tech?.counts.lateCount).toBe(1);
      expect(tech?.counts.totalRecords).toBe(2);

      const finance = deptStats.find((d) => d.name === 'Finance');
      expect(finance).toBeDefined();
      expect(finance?.total).toBe(1);
      expect(finance?.counts.leaveCount).toBe(1);
    });
  });
});
