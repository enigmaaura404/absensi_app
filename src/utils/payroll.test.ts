import { describe, it, expect } from 'vitest';
import { derivePayrollPreparation, formatIDR, getPayrollPeriods } from './payroll';
import { AttendanceRecord, User } from '../types';

// ─── Fixtures ────────────────────────────────────────────────────────────────

const mockEmployee: User = {
  id: 'usr-1',
  employeeId: 'EMP-00124',
  name: 'Budi Santoso',
  email: 'budi@example.com',
  phone: '0812-3456-7890',
  role: 'Employee',
  department: 'Technology',
  position: 'Senior Software Engineer',
  joinDate: '12 January 2024',
  avatar: '',
  status: 'Active',
  faceVerified: true,
  deviceVerified: true,
  leaveBalance: { total: 12, used: 8, pending: 2, remaining: 4 },
};

const makeRecord = (
  date: string,
  status: AttendanceRecord['status'],
  durationMinutes: number | null = null
): AttendanceRecord => ({
  id: `att-${date}`,
  employeeId: 'EMP-00124',
  employeeName: 'Budi Santoso',
  department: 'Technology',
  date,
  checkInTime: durationMinutes !== null ? '08:00' : null,
  checkOutTime: durationMinutes !== null ? '17:00' : null,
  status,
  duration: durationMinutes !== null ? `${Math.floor(durationMinutes / 60)}j ${durationMinutes % 60}m` : null,
  durationMinutes,
  location: 'Kantor Pusat',
  device: 'Samsung',
  ip: '127.0.0.1',
});

// Period: 2026-10-01 to 2026-10-31 (22 working days)
const PERIOD = {
  startDate: '2026-10-01',
  endDate: '2026-10-31',
  label: 'Oktober 2026',
};

// ─── formatIDR ────────────────────────────────────────────────────────────────

describe('formatIDR', () => {
  it('formats 1450000 as Rp 1.450.000', () => {
    expect(formatIDR(1_450_000)).toBe('Rp 1.450.000');
  });

  it('formats 0 as Rp 0', () => {
    expect(formatIDR(0)).toBe('Rp 0');
  });

  it('formats small amounts correctly', () => {
    expect(formatIDR(500_000)).toBe('Rp 500.000');
  });
});

// ─── getPayrollPeriods ────────────────────────────────────────────────────────

describe('getPayrollPeriods', () => {
  it('returns 3 periods', () => {
    const periods = getPayrollPeriods();
    expect(periods).toHaveLength(3);
  });

  it('each period has startDate, endDate, and label', () => {
    for (const p of getPayrollPeriods()) {
      expect(p.startDate).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(p.endDate).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(p.label.length).toBeGreaterThan(0);
    }
  });
});

// ─── derivePayrollPreparation ─────────────────────────────────────────────────

describe('derivePayrollPreparation', () => {
  it('returns an empty array when no employees', () => {
    const result = derivePayrollPreparation([], [], PERIOD);
    expect(result).toHaveLength(0);
  });

  it('filters out Inactive employees', () => {
    const inactiveEmp: User = { ...mockEmployee, status: 'Inactive' };
    const result = derivePayrollPreparation([inactiveEmp], [], PERIOD);
    expect(result).toHaveLength(0);
  });

  it('correctly counts present days from Hadir and Terlambat records', () => {
    const records: AttendanceRecord[] = [
      makeRecord('2026-10-05', 'Hadir', 480),
      makeRecord('2026-10-06', 'Terlambat', 480),
      makeRecord('2026-10-07', 'Hadir', 480),
    ];
    const [item] = derivePayrollPreparation([mockEmployee], records, PERIOD);
    expect(item.presentDays).toBe(3);
  });

  it('correctly counts late incidents (Terlambat only)', () => {
    const records: AttendanceRecord[] = [
      makeRecord('2026-10-05', 'Hadir', 480),
      makeRecord('2026-10-06', 'Terlambat', 480),
      makeRecord('2026-10-07', 'Terlambat', 480),
    ];
    const [item] = derivePayrollPreparation([mockEmployee], records, PERIOD);
    expect(item.lateCount).toBe(2);
  });

  it('correctly counts leave days (Cuti, Izin, Sakit, Dinas)', () => {
    const records: AttendanceRecord[] = [
      makeRecord('2026-10-05', 'Cuti'),
      makeRecord('2026-10-06', 'Izin'),
      makeRecord('2026-10-07', 'Sakit'),
      makeRecord('2026-10-08', 'Dinas'),
    ];
    const [item] = derivePayrollPreparation([mockEmployee], records, PERIOD);
    expect(item.leaveDays).toBe(4);
  });

  it('calculates overtime hours from durationMinutes > 480', () => {
    // 600 min = 2h overtime
    const records: AttendanceRecord[] = [
      makeRecord('2026-10-05', 'Hadir', 600),
      makeRecord('2026-10-06', 'Hadir', 480), // no overtime
    ];
    const [item] = derivePayrollPreparation([mockEmployee], records, PERIOD);
    expect(item.overtimeHours).toBe(2);
  });

  it('marks status as Ready when lateCount <= 2 and absentDays === 0', () => {
    // Build 22 present records spanning the full month (Mon–Fri of Oct 2026 = 22 working days)
    // 2026-10-01..2026-10-31: Mon=6,7,8,9,10,13,14,15,16,17,20,21,22,23,24,27,28,29,30,31
    // Oct 1 = Thu, skip Sat(4)/Sun(5), ...
    const workdays = [
      '2026-10-01','2026-10-02','2026-10-05','2026-10-06','2026-10-07',
      '2026-10-08','2026-10-09','2026-10-12','2026-10-13','2026-10-14',
      '2026-10-15','2026-10-16','2026-10-19','2026-10-20','2026-10-21',
      '2026-10-22','2026-10-23','2026-10-26','2026-10-27','2026-10-28',
      '2026-10-29','2026-10-30',
    ];
    const records = workdays.map((d, i) =>
      makeRecord(d, i < 2 ? 'Terlambat' : 'Hadir', 480)
    );
    const [item] = derivePayrollPreparation([mockEmployee], records, PERIOD);
    // lateCount = 2 (not > 2), absentDays = 0
    expect(item.lateCount).toBe(2);
    expect(item.absentDays).toBe(0);
    expect(item.status).toBe('Ready');
  });

  it('marks status as Review Needed when lateCount > 2', () => {
    const records = [
      makeRecord('2026-10-05', 'Terlambat', 480),
      makeRecord('2026-10-06', 'Terlambat', 480),
      makeRecord('2026-10-07', 'Terlambat', 480),
    ];
    const [item] = derivePayrollPreparation([mockEmployee], records, PERIOD);
    expect(item.status).toBe('Review Needed');
  });

  it('marks status as Review Needed when absentDays > 0', () => {
    // No records at all → all working days are absent
    const [item] = derivePayrollPreparation([mockEmployee], [], PERIOD);
    expect(item.absentDays).toBeGreaterThan(0);
    expect(item.status).toBe('Review Needed');
  });

  it('calculates tunjangan kehadiran: base - late deduction + overtime bonus', () => {
    // 5 present (1 late, 4 hadir), 1 overtime hour (600 min session)
    const records = [
      makeRecord('2026-10-05', 'Hadir', 480),
      makeRecord('2026-10-06', 'Hadir', 480),
      makeRecord('2026-10-07', 'Hadir', 480),
      makeRecord('2026-10-08', 'Hadir', 600), // +120 min overtime → 2h
      makeRecord('2026-10-09', 'Terlambat', 480),
    ];
    const [item] = derivePayrollPreparation([mockEmployee], records, PERIOD);
    // base: 5 * 50000 = 250000
    // late: 1 * 25000 = -25000
    // overtime: 2 * 35000 = +70000 (600-480=120min = 2h)
    // total: 295000
    expect(item.calculatedAllowance).toBe('Rp 295.000');
  });
});
