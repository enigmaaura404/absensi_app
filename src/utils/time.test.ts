import { describe, it, expect } from 'vitest';
import {
  getTodayDateString,
  parseTimeToMinutes,
  calculateWorkDuration,
  isLateCheckIn,
} from './time';

describe('Time Utilities', () => {
  it('formats current date correctly as YYYY-MM-DD', () => {
    const testDate = new Date(2026, 9, 3); // Oct 3, 2026
    expect(getTodayDateString(testDate)).toBe('2026-10-03');
  });

  it('parses time strings to minutes', () => {
    expect(parseTimeToMinutes('08:00')).toBe(480);
    expect(parseTimeToMinutes('08:30 WIB')).toBe(510);
    expect(parseTimeToMinutes('17:45')).toBe(1065);
    expect(parseTimeToMinutes('')).toBe(0);
  });

  it('calculates standard work duration between check-in and check-out', () => {
    const result = calculateWorkDuration('08:00', '17:00');
    expect(result.durationMinutes).toBe(540); // 9 hours
    expect(result.formatted).toBe('9j 00m');
  });

  it('calculates duration with minutes correctly', () => {
    const result = calculateWorkDuration('08:15', '16:45');
    expect(result.durationMinutes).toBe(510); // 8h 30m
    expect(result.formatted).toBe('8j 30m');
  });

  it('handles overnight shifts crossing midnight', () => {
    const result = calculateWorkDuration('22:00', '06:00');
    expect(result.durationMinutes).toBe(480); // 8 hours
    expect(result.formatted).toBe('8j 00m');
  });

  it('detects late check-in accurately with tolerance grace period', () => {
    // Expected: 08:00
    // Check-in: 08:10 with 0 min tolerance -> Late (true)
    const isLateZeroTolerance = isLateCheckIn('08:10', '08:00', 0);
    expect(isLateZeroTolerance).toBe(true);

    // Check-in: 08:10 with 15 min tolerance -> On time (false)
    const isLateWithGrace = isLateCheckIn('08:10', '08:00', 15);
    expect(isLateWithGrace).toBe(false);

    // Check-in: 08:00 exactly -> On time (false)
    const isOnTime = isLateCheckIn('08:00', '08:00', 0);
    expect(isOnTime).toBe(false);
  });
});
