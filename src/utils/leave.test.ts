import { describe, it, expect } from 'vitest';
import {
  calculateWorkingDays,
  validateLeaveApplication,
  canApproveRequest,
  calculateLeaveDeduction,
  checkLeaveOverlap,
} from './leave';

describe('Leave & Working Days Utilities', () => {
  it('calculates 5 working days for Monday through Friday of the same week', () => {
    // 2026-10-05 (Monday) to 2026-10-09 (Friday)
    const result = calculateWorkingDays('2026-10-05', '2026-10-09');
    expect(result.workingDays).toBe(5);
    expect(result.weekendDays).toBe(0);
    expect(result.totalCalendarDays).toBe(5);
  });

  it('excludes Saturday and Sunday over a weekend span', () => {
    // 2026-10-05 (Monday) to 2026-10-12 (Next Monday)
    // Mon, Tue, Wed, Thu, Fri, Sat(weekend), Sun(weekend), Mon
    const result = calculateWorkingDays('2026-10-05', '2026-10-12');
    expect(result.totalCalendarDays).toBe(8);
    expect(result.weekendDays).toBe(2);
    expect(result.workingDays).toBe(6);
  });

  it('excludes registered public holidays falling on a weekday', () => {
    // 2026-10-05 to 2026-10-09, with 2026-10-07 (Wednesday) as a registered holiday
    const result = calculateWorkingDays('2026-10-05', '2026-10-09', ['2026-10-07']);
    expect(result.workingDays).toBe(4);
    expect(result.holidayDays).toBe(1);
    expect(result.totalCalendarDays).toBe(5);
  });

  it('does not double count holidays that fall on a weekend', () => {
    // 2026-10-05 to 2026-10-12, holiday on 2026-10-10 (Saturday)
    const result = calculateWorkingDays('2026-10-05', '2026-10-12', ['2026-10-10']);
    expect(result.weekendDays).toBe(2);
    expect(result.workingDays).toBe(6);
  });

  it('returns zero working days when start date is after end date', () => {
    const result = calculateWorkingDays('2026-10-10', '2026-10-05');
    expect(result.workingDays).toBe(0);
    expect(result.totalCalendarDays).toBe(0);
  });
});

describe('Leave Business Rules & Validation', () => {
  it('prevents self-approval when approver is the requester (BR-APP-001)', () => {
    const check = canApproveRequest('EMP-00124', 'EMP-00124');
    expect(check.allowed).toBe(false);
    expect(check.reason).toContain('Self-Approval Dilarang');
  });

  it('allows approval when approver is different from requester', () => {
    const check = canApproveRequest('EMP-00018', 'EMP-00124');
    expect(check.allowed).toBe(true);
    expect(check.reason).toBeUndefined();
  });

  it('blocks approval if employee ID is missing', () => {
    expect(canApproveRequest(undefined, 'EMP-00124').allowed).toBe(false);
    expect(canApproveRequest('EMP-00018', undefined).allowed).toBe(false);
  });

  it('validates leave application against sufficient balance (BR-LEAVE-002)', () => {
    expect(validateLeaveApplication(3, 5).valid).toBe(true);
    expect(validateLeaveApplication(5, 5).valid).toBe(true);
  });

  it('rejects leave application if requested days exceed remaining balance', () => {
    const result = validateLeaveApplication(6, 5);
    expect(result.valid).toBe(false);
    expect(result.reason).toContain('tidak mencukupi');
  });

  it('rejects leave application for 0 or negative days', () => {
    expect(validateLeaveApplication(0, 5).valid).toBe(false);
    expect(validateLeaveApplication(-1, 5).valid).toBe(false);
  });

  it('correctly calculates leave balance deduction (BR-LEAVE-001)', () => {
    const initialBalance = { total: 12, used: 4, remaining: 8, pending: 0 };
    const updated = calculateLeaveDeduction(initialBalance, 3);
    expect(updated.remaining).toBe(5);
    expect(updated.used).toBe(7);
  });

  it('does not allow remaining balance to drop below zero', () => {
    const initialBalance = { total: 12, used: 10, remaining: 2 };
    const updated = calculateLeaveDeduction(initialBalance, 5);
    expect(updated.remaining).toBe(0);
    expect(updated.used).toBe(15);
  });
});

describe('Leave Overlap Check (BR-LEAVE-003)', () => {
  const baseRequests = [
    {
      id: 'req-1',
      employeeId: 'EMP-00124',
      startDate: '2026-10-10',
      endDate: '2026-10-15',
      status: 'Approved',
      type: 'Cuti',
    },
    {
      id: 'req-2',
      employeeId: 'EMP-00124',
      startDate: '2026-10-20',
      endDate: '2026-10-22',
      status: 'Pending',
      type: 'Izin',
    },
  ];

  it('detects an exact date overlap with an Approved request', () => {
    const result = checkLeaveOverlap('EMP-00124', '2026-10-12', '2026-10-14', baseRequests);
    expect(result.overlaps).toBe(true);
    expect(result.conflictingId).toBe('req-1');
    expect(result.conflictingType).toBe('Cuti');
  });

  it('detects a partial overlap at the start of an existing request', () => {
    const result = checkLeaveOverlap('EMP-00124', '2026-10-08', '2026-10-11', baseRequests);
    expect(result.overlaps).toBe(true);
    expect(result.conflictingId).toBe('req-1');
  });

  it('detects a partial overlap at the end of an existing request', () => {
    const result = checkLeaveOverlap('EMP-00124', '2026-10-14', '2026-10-18', baseRequests);
    expect(result.overlaps).toBe(true);
    expect(result.conflictingId).toBe('req-1');
  });

  it('detects overlap with a Pending request', () => {
    const result = checkLeaveOverlap('EMP-00124', '2026-10-21', '2026-10-21', baseRequests);
    expect(result.overlaps).toBe(true);
    expect(result.conflictingId).toBe('req-2');
  });

  it('allows dates adjacent to but not overlapping an existing request', () => {
    // Day after req-1 ends (2026-10-16)
    const result = checkLeaveOverlap('EMP-00124', '2026-10-16', '2026-10-19', baseRequests);
    expect(result.overlaps).toBe(false);
  });

  it('does not block overlap for a different employee', () => {
    // EMP-00999 has no requests
    const result = checkLeaveOverlap('EMP-00999', '2026-10-12', '2026-10-14', baseRequests);
    expect(result.overlaps).toBe(false);
  });

  it('ignores Rejected and Cancelled requests when checking overlap', () => {
    const requestsWithRejected = [
      {
        id: 'req-old',
        employeeId: 'EMP-00124',
        startDate: '2026-10-10',
        endDate: '2026-10-15',
        status: 'Rejected', // should be ignored
        type: 'Cuti',
      },
    ];
    const result = checkLeaveOverlap('EMP-00124', '2026-10-10', '2026-10-15', requestsWithRejected);
    expect(result.overlaps).toBe(false);
  });
});
