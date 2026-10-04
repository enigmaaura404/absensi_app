/**
 * Time and Date Utilities for Attendance Management
 */

/**
 * Returns current date formatted as YYYY-MM-DD in local timezone
 */
export function getTodayDateString(date: Date = new Date()): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Parses time string (e.g. "08:05", "08:05 WIB", "08:05:30") into minutes since midnight
 */
export function parseTimeToMinutes(timeStr: string): number {
  if (!timeStr) return 0;
  const cleanStr = timeStr.replace(/\s*(WIB|WITA|WIT)\s*/i, '').trim();
  const parts = cleanStr.split(':').map((p) => parseInt(p, 10));
  if (parts.length < 2 || isNaN(parts[0]) || isNaN(parts[1])) return 0;
  return parts[0] * 60 + parts[1];
}

/**
 * Calculates work duration between check-in and check-out times in minutes and formatted string
 */
export function calculateWorkDuration(
  checkInTime: string | null | undefined,
  checkOutTime: string | null | undefined
): { durationMinutes: number; formatted: string } {
  if (!checkInTime || !checkOutTime) {
    return { durationMinutes: 0, formatted: '0m' };
  }

  const inMinutes = parseTimeToMinutes(checkInTime);
  const outMinutes = parseTimeToMinutes(checkOutTime);

  // If check-out is before check-in, handle overnight shift
  let diffMinutes = outMinutes - inMinutes;
  if (diffMinutes < 0) {
    diffMinutes += 24 * 60; // 24 hours rollover
  }

  const hours = Math.floor(diffMinutes / 60);
  const minutes = diffMinutes % 60;

  let formatted = '';
  if (hours > 0) {
    formatted = `${hours}j ${String(minutes).padStart(2, '0')}m`;
  } else {
    formatted = `${minutes}m`;
  }

  return {
    durationMinutes: diffMinutes,
    formatted,
  };
}

/**
 * Determines whether a check-in is late given the schedule start time and grace period
 */
export function isLateCheckIn(
  checkInTime: string,
  scheduleStartTime: string = '08:00',
  gracePeriodMinutes: number = 10
): boolean {
  const inMinutes = parseTimeToMinutes(checkInTime);
  const startMinutes = parseTimeToMinutes(scheduleStartTime);
  const lateThreshold = startMinutes + gracePeriodMinutes;

  return inMinutes > lateThreshold;
}

/**
 * Formats time as HH:mm WIB
 */
export function formatTimeWIB(date: Date = new Date()): string {
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${hours}:${minutes} WIB`;
}

/**
 * Formats date in Indonesian locale (e.g. "Sabtu, 3 Oktober 2026")
 */
export function formatDateIndonesian(date: Date = new Date()): string {
  return date.toLocaleDateString('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}
