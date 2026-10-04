import { describe, it, expect } from 'vitest';
import {
  canEmployeeCheckIn,
  canEmployeeCheckOut,
  determineAttendanceStatus,
  calculateLateMinutes,
  DEFAULT_SHIFTS,
} from './attendance';
import { AttendanceRecord } from '../types';

describe('Attendance Core Business Rules', () => {
  const mockRecord: AttendanceRecord = {
    id: 'att-1',
    employeeId: 'EMP-00124',
    employeeName: 'Budi Santoso',
    department: 'Technology',
    date: '2026-10-03',
    checkInTime: '08:05',
    checkOutTime: null,
    status: 'Hadir',
    duration: 'Berjalan',
    durationMinutes: null,
    location: 'Kantor Pusat',
    device: 'Samsung Galaxy S24',
    ip: '182.253.14.88',
  };

  describe('canEmployeeCheckIn (BR-ATT-004)', () => {
    it('allows check-in if no record exists for today', () => {
      const result = canEmployeeCheckIn([], 'EMP-00124', '2026-10-03');
      expect(result.allowed).toBe(true);
    });

    it('allows check-in if records exist for other employees or other dates', () => {
      const records: AttendanceRecord[] = [
        { ...mockRecord, employeeId: 'EMP-00125' },
        { ...mockRecord, date: '2026-10-02' },
      ];
      const result = canEmployeeCheckIn(records, 'EMP-00124', '2026-10-03');
      expect(result.allowed).toBe(true);
    });

    it('blocks duplicate check-in if employee already checked in today', () => {
      const result = canEmployeeCheckIn([mockRecord], 'EMP-00124', '2026-10-03');
      expect(result.allowed).toBe(false);
      expect(result.reason).toContain('sudah tercatat check-in');
    });
  });

  describe('canEmployeeCheckOut (BR-ATT-001)', () => {
    it('blocks checkout if employee has not checked in today', () => {
      const result = canEmployeeCheckOut(undefined);
      expect(result.allowed).toBe(false);
      expect(result.reason).toContain('belum melakukan check-in');
    });

    it('blocks checkout if checkInTime is null', () => {
      const recordWithoutIn: AttendanceRecord = {
        ...mockRecord,
        checkInTime: null,
      };
      const result = canEmployeeCheckOut(recordWithoutIn);
      expect(result.allowed).toBe(false);
      expect(result.reason).toContain('belum melakukan check-in');
    });

    it('allows checkout if checked in but not yet checked out', () => {
      const result = canEmployeeCheckOut(mockRecord);
      expect(result.allowed).toBe(true);
    });

    it('blocks duplicate checkout if employee already checked out today', () => {
      const recordCheckedOut: AttendanceRecord = {
        ...mockRecord,
        checkOutTime: '17:05',
        duration: '9j 00m',
        durationMinutes: 540,
      };
      const result = canEmployeeCheckOut(recordCheckedOut);
      expect(result.allowed).toBe(false);
      expect(result.reason).toContain('sudah melakukan check-out');
    });
  });

  describe('Attendance Status & Late Rules (BR-ATT-009)', () => {
    it('marks check-in before schedule start as Hadir', () => {
      expect(determineAttendanceStatus('07:55')).toBe('Hadir');
      expect(calculateLateMinutes('07:55')).toBe(0);
    });

    it('marks check-in on time as Hadir', () => {
      expect(determineAttendanceStatus('08:00')).toBe('Hadir');
      expect(calculateLateMinutes('08:00')).toBe(0);
    });

    it('marks check-in within grace period (e.g. 08:08 vs 08:00 + 10m) as Hadir', () => {
      expect(determineAttendanceStatus('08:08')).toBe('Hadir');
      expect(calculateLateMinutes('08:08')).toBe(0);
    });

    it('marks check-in after grace period (e.g. 08:15 vs 08:00 + 10m) as Terlambat', () => {
      expect(determineAttendanceStatus('08:15')).toBe('Terlambat');
      expect(calculateLateMinutes('08:15')).toBe(15);
    });

    it('handles custom shift hours properly (e.g. Shift Siang 13:00)', () => {
      const shiftSiang = DEFAULT_SHIFTS[1]; // 13:00 - 21:00
      expect(determineAttendanceStatus('13:05', shiftSiang)).toBe('Hadir');
      expect(determineAttendanceStatus('13:15', shiftSiang)).toBe('Terlambat');
      expect(calculateLateMinutes('13:25', shiftSiang)).toBe(25);
    });
  });
});
