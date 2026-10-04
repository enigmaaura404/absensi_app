/**
 * Payroll Preparation Utilities
 *
 * Derives PayrollPrepItem[] from real AttendanceRecord data for a given cutoff period.
 *
 * Business rules enforced here:
 * - PR-001: Working days = total working days in the period (Mon–Fri, ex-holidays)
 * - PR-002: Present days = records with status Hadir | Terlambat in the period
 * - PR-003: Late count = records with status Terlambat
 * - PR-004: Leave days = records with status Cuti | Izin | Sakit | Dinas
 * - PR-005: Absent days = working days − present days − leave days
 * - PR-006: Overtime hours = total durationMinutes > shiftDurationMinutes / 60 (per session)
 * - PR-007: Tunjangan Kehadiran = f(present, late, overtime, absent)
 *           Base: Rp 50,000 per present day
 *           Late deduction: Rp 25,000 per incident
 *           Overtime bonus: Rp 35,000 per hour (whole hours only)
 *           Absent penalty: no base for absent days
 * - PR-008: Status = 'Review Needed' when absentDays > 0 or lateCount > 2, else 'Ready'
 */

import { AttendanceRecord, PayrollPrepItem, User } from '../types';

const STANDARD_SHIFT_MINUTES = 480; // 8 hours = 480 min
const ALLOWANCE_PER_PRESENT_DAY = 50_000; // IDR
const LATE_DEDUCTION_PER_INCIDENT = 25_000; // IDR
const OVERTIME_BONUS_PER_HOUR = 35_000; // IDR

/**
 * Formats IDR currency for display (e.g. "Rp 1.450.000").
 */
export function formatIDR(amount: number): string {
  if (amount <= 0) return 'Rp 0';
  const formatted = amount
    .toFixed(0)
    .replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  return `Rp ${formatted}`;
}

/**
 * Counts working days (Mon–Fri) in a date range, excluding holiday dates.
 */
function countWorkingDaysInRange(
  startDate: Date,
  endDate: Date,
  holidayDates: Set<string>
): number {
  let count = 0;
  const cur = new Date(startDate);
  cur.setHours(0, 0, 0, 0);
  const end = new Date(endDate);
  end.setHours(23, 59, 59, 999);

  while (cur <= end) {
    const dow = cur.getDay(); // 0=Sun, 6=Sat
    if (dow !== 0 && dow !== 6) {
      const iso = cur.toISOString().slice(0, 10);
      if (!holidayDates.has(iso)) {
        count++;
      }
    }
    cur.setDate(cur.getDate() + 1);
  }
  return count;
}

export interface PayrollPeriod {
  /** ISO date string (inclusive) — typically day 1 of the month */
  startDate: string;
  /** ISO date string (inclusive) — typically cutoff day (e.g. last working day) */
  endDate: string;
  /** Display label, e.g. "Oktober 2026" */
  label: string;
}

/**
 * Derives a full PayrollPrepItem[] from attendance records for a given period and employee list.
 *
 * @param employees    The full employee roster
 * @param records      All attendance records (across all dates and employees)
 * @param period       The cutoff period (startDate, endDate)
 * @param holidayDates ISO date strings of public/company holidays
 */
export function derivePayrollPreparation(
  employees: User[],
  records: AttendanceRecord[],
  period: PayrollPeriod,
  holidayDates: string[] = []
): PayrollPrepItem[] {
  const periodStart = new Date(period.startDate);
  const periodEnd = new Date(period.endDate);
  periodStart.setHours(0, 0, 0, 0);
  periodEnd.setHours(23, 59, 59, 999);

  const holidaySet = new Set(holidayDates);

  const workingDaysInPeriod = countWorkingDaysInRange(periodStart, periodEnd, holidaySet);

  // Filter records to this period only
  const periodRecords = records.filter((r) => {
    const d = new Date(r.date);
    return d >= periodStart && d <= periodEnd;
  });

  return employees
    .filter((emp) => emp.status !== 'Inactive')
    .map((emp) => {
      const empRecords = periodRecords.filter((r) => r.employeeId === emp.employeeId);

      // Present days: Hadir or Terlambat (employee was physically present)
      const presentDays = empRecords.filter(
        (r) => r.status === 'Hadir' || r.status === 'Terlambat'
      ).length;

      // Late count: only Terlambat records
      const lateCount = empRecords.filter((r) => r.status === 'Terlambat').length;

      // Leave days: Cuti | Izin | Sakit | Dinas
      const leaveDays = empRecords.filter(
        (r) =>
          r.status === 'Cuti' ||
          r.status === 'Izin' ||
          r.status === 'Sakit' ||
          r.status === 'Dinas'
      ).length;

      // Absent days: working days not accounted for by present or leave
      const absentDays = Math.max(0, workingDaysInPeriod - presentDays - leaveDays);

      // Overtime hours: total minutes worked beyond standard shift duration
      const totalOvertimeMinutes = empRecords.reduce((sum, r) => {
        if (r.durationMinutes != null && r.durationMinutes > STANDARD_SHIFT_MINUTES) {
          return sum + (r.durationMinutes - STANDARD_SHIFT_MINUTES);
        }
        return sum;
      }, 0);
      const overtimeHours = Math.floor(totalOvertimeMinutes / 60);

      // Tunjangan Kehadiran (Attendance Allowance)
      const baseAllowance = presentDays * ALLOWANCE_PER_PRESENT_DAY;
      const lateDeduction = lateCount * LATE_DEDUCTION_PER_INCIDENT;
      const overtimeBonus = overtimeHours * OVERTIME_BONUS_PER_HOUR;
      const calculatedAllowanceAmount = Math.max(0, baseAllowance - lateDeduction + overtimeBonus);

      // Status determination (PR-008)
      const status: PayrollPrepItem['status'] =
        absentDays > 0 || lateCount > 2 ? 'Review Needed' : 'Ready';

      return {
        employeeId: emp.employeeId,
        employeeName: emp.name,
        department: emp.department,
        position: emp.position,
        workingDays: workingDaysInPeriod,
        presentDays,
        lateCount,
        overtimeHours,
        leaveDays,
        absentDays,
        calculatedAllowance: formatIDR(calculatedAllowanceAmount),
        status,
      };
    });
}

/**
 * Returns common payroll periods for the current and previous month.
 * Used for the period selector in PayrollPage.
 */
export function getPayrollPeriods(): PayrollPeriod[] {
  const now = new Date();

  const makeMonthPeriod = (year: number, month: number): PayrollPeriod => {
    const start = new Date(year, month, 1);
    const end = new Date(year, month + 1, 0); // last day of month
    const label = start.toLocaleDateString('id-ID', { month: 'long', year: 'numeric' });
    return {
      startDate: start.toISOString().slice(0, 10),
      endDate: end.toISOString().slice(0, 10),
      label: label.charAt(0).toUpperCase() + label.slice(1),
    };
  };

  const currentMonth = makeMonthPeriod(now.getFullYear(), now.getMonth());
  const prevMonth = makeMonthPeriod(
    now.getMonth() === 0 ? now.getFullYear() - 1 : now.getFullYear(),
    now.getMonth() === 0 ? 11 : now.getMonth() - 1
  );
  const twoMonthsAgo = makeMonthPeriod(
    now.getMonth() <= 1 ? now.getFullYear() - 1 : now.getFullYear(),
    (now.getMonth() - 2 + 12) % 12
  );

  return [currentMonth, prevMonth, twoMonthsAgo];
}
