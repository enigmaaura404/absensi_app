import { AttendanceRecord, AttendanceStatus, Shift } from '../types';
import { isLateCheckIn, parseTimeToMinutes } from './time';

/**
 * Attendance Core Business Rules
 */

export const DEFAULT_SHIFTS: Shift[] = [
  {
    id: 'shift-pagi',
    name: 'Shift Pagi (Regular)',
    code: 'PAGI',
    startTime: '08:00',
    endTime: '17:00',
    gracePeriodMinutes: 10,
    breakStartTime: '12:00',
    breakEndTime: '13:00',
    isOvernight: false,
  },
  {
    id: 'shift-siang',
    name: 'Shift Siang',
    code: 'SIANG',
    startTime: '13:00',
    endTime: '21:00',
    gracePeriodMinutes: 10,
    breakStartTime: '17:00',
    breakEndTime: '18:00',
    isOvernight: false,
  },
  {
    id: 'shift-malam',
    name: 'Shift Malam',
    code: 'MALAM',
    startTime: '21:00',
    endTime: '06:00',
    gracePeriodMinutes: 10,
    isOvernight: true,
  },
];

/**
 * Determines attendance status based on shift start time, grace period, and approved requests (BR-ATT-009)
 */
export function determineAttendanceStatus(
  checkInTime: string,
  shift: Shift = DEFAULT_SHIFTS[0],
  isApprovedDinas: boolean = false
): AttendanceStatus {
  if (isApprovedDinas) {
    return 'Dinas';
  }
  return isLateCheckIn(checkInTime, shift.startTime, shift.gracePeriodMinutes)
    ? 'Terlambat'
    : 'Hadir';
}

/**
 * Evaluates the attendance session state (NOT_STARTED, OPEN, COMPLETED, FORGOT_CHECKOUT)
 */
export function evaluateSessionState(
  record: AttendanceRecord | undefined,
  currentMinutesSinceMidnight: number = 0,
  shift: Shift = DEFAULT_SHIFTS[0]
): 'NOT_STARTED' | 'OPEN' | 'COMPLETED' | 'FORGOT_CHECKOUT' {
  if (!record || !record.checkInTime) {
    return 'NOT_STARTED';
  }

  if (record.checkOutTime) {
    return 'COMPLETED';
  }

  // If currently after shift end + 4 hours (e.g. 21:00 for a 17:00 shift), flag as FORGOT_CHECKOUT
  const shiftEndMinutes = parseTimeToMinutes(shift.endTime);
  if (
    currentMinutesSinceMidnight > 0 &&
    !shift.isOvernight &&
    currentMinutesSinceMidnight > shiftEndMinutes + 240
  ) {
    return 'FORGOT_CHECKOUT';
  }

  return 'OPEN';
}

/**
 * Calculates how many minutes late an employee is compared to shift start
 */
export function calculateLateMinutes(
  checkInTime: string,
  shift: Shift = DEFAULT_SHIFTS[0]
): number {
  const inMin = parseTimeToMinutes(checkInTime);
  const startMin = parseTimeToMinutes(shift.startTime);
  const threshold = startMin + shift.gracePeriodMinutes;

  if (inMin <= threshold) {
    return 0;
  }
  return inMin - startMin;
}

/**
 * Validates whether an employee can check in (BR-ATT-004: Only one check-in per day allowed)
 */
export function canEmployeeCheckIn(
  records: AttendanceRecord[],
  employeeId: string,
  date: string,
  hasActiveLeaveToday: boolean = false
): { allowed: boolean; reason?: string } {
  if (hasActiveLeaveToday) {
    return {
      allowed: false,
      reason: 'Anda memiliki permohonan Cuti/Sakit/Izin yang telah disetujui pada tanggal ini.',
    };
  }

  const existing = records.find(
    (r) => r.employeeId === employeeId && r.date === date && r.checkInTime !== null
  );

  if (existing) {
    return {
      allowed: false,
      reason: `Karyawan sudah tercatat check-in pada hari ini pukul ${existing.checkInTime}.`,
    };
  }

  return { allowed: true };
}

/**
 * Validates whether an employee can check out (BR-ATT-001: Cannot check out before check in)
 */
export function canEmployeeCheckOut(
  todayRecord: AttendanceRecord | undefined
): { allowed: boolean; reason?: string } {
  if (!todayRecord || !todayRecord.checkInTime) {
    return {
      allowed: false,
      reason: 'Anda belum melakukan check-in hari ini. Check-out hanya dapat dilakukan setelah check-in.',
    };
  }

  if (todayRecord.checkOutTime) {
    return {
      allowed: false,
      reason: `Anda sudah melakukan check-out hari ini pukul ${todayRecord.checkOutTime}.`,
    };
  }

  return { allowed: true };
}

