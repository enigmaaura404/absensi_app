import { describe, it, expect } from 'vitest';
import {
  canApproveRequest,
  checkLeaveOverlap,
  calculateLeaveDeduction,
  validateLeaveApplication,
} from './leave';
import { RequestItem } from '../types';

/**
 * Approval Business Rules (BR-APP-001, BR-APP-002)
 * These tests are dedicated to the approval workflow.
 * Core leave tests remain in leave.test.ts.
 */
describe('Approval Business Rules', () => {
  // ─── BR-APP-001: Self-Approval Prevention ────────────────────────────────

  describe('BR-APP-001 — Self-Approval Prevention', () => {
    it('blocks self-approval: same employeeId for approver and requester', () => {
      const result = canApproveRequest('EMP-00124', 'EMP-00124');
      expect(result.allowed).toBe(false);
      expect(result.reason).toBeTruthy();
    });

    it('allows cross-employee approval', () => {
      expect(canApproveRequest('EMP-00018', 'EMP-00124').allowed).toBe(true);
      expect(canApproveRequest('EMP-00005', 'EMP-00124').allowed).toBe(true);
    });

    it('blocks approval when approver is undefined', () => {
      expect(canApproveRequest(undefined, 'EMP-00124').allowed).toBe(false);
    });

    it('blocks approval when requester is undefined', () => {
      expect(canApproveRequest('EMP-00124', undefined).allowed).toBe(false);
    });

    it('blocks approval when both are undefined', () => {
      expect(canApproveRequest(undefined, undefined).allowed).toBe(false);
    });
  });

  // ─── BR-LEAVE-002: Leave Balance Validation ───────────────────────────────

  describe('BR-LEAVE-002 — Leave Balance Validation', () => {
    it('allows leave when requested days equal remaining balance', () => {
      expect(validateLeaveApplication(5, 5).valid).toBe(true);
    });

    it('allows leave when requested days are less than remaining balance', () => {
      expect(validateLeaveApplication(1, 12).valid).toBe(true);
    });

    it('rejects leave when requested days exceed remaining balance by 1', () => {
      const result = validateLeaveApplication(6, 5);
      expect(result.valid).toBe(false);
      expect(result.reason).toBeTruthy();
    });

    it('rejects leave with 0 requested days', () => {
      expect(validateLeaveApplication(0, 10).valid).toBe(false);
    });

    it('rejects leave with negative requested days', () => {
      expect(validateLeaveApplication(-3, 10).valid).toBe(false);
    });

    it('rejects leave when balance is 0', () => {
      expect(validateLeaveApplication(1, 0).valid).toBe(false);
    });
  });

  // ─── BR-LEAVE-001: Atomic Leave Balance Deduction ────────────────────────

  describe('BR-LEAVE-001 — Atomic Leave Balance Deduction', () => {
    it('correctly deducts working days from remaining balance', () => {
      const balance = { total: 12, used: 2, remaining: 10, pending: 0 };
      const result = calculateLeaveDeduction(balance, 4);
      expect(result.remaining).toBe(6);
      expect(result.used).toBe(6);
    });

    it('clamps remaining to 0 if deduction exceeds balance (safety guard)', () => {
      const balance = { total: 12, used: 11, remaining: 1 };
      const result = calculateLeaveDeduction(balance, 5);
      expect(result.remaining).toBe(0);
      expect(result.used).toBe(16);
    });

    it('does not mutate the original balance object', () => {
      const original = { total: 12, used: 4, remaining: 8, pending: 0 };
      const copy = { ...original };
      calculateLeaveDeduction(original, 2);
      expect(original.remaining).toBe(copy.remaining);
      expect(original.used).toBe(copy.used);
    });
  });

  // ─── BR-LEAVE-003: Leave Date Overlap Detection ───────────────────────────

  describe('BR-LEAVE-003 — Leave Date Overlap Detection', () => {
    const baseRequests: Array<{
      id: string;
      employeeId: string;
      startDate: string;
      endDate: string;
      status: string;
      type: string;
    }> = [
      {
        id: 'req-A',
        employeeId: 'EMP-00124',
        startDate: '2026-11-10',
        endDate: '2026-11-14',
        status: 'Approved',
        type: 'Cuti',
      },
      {
        id: 'req-B',
        employeeId: 'EMP-00124',
        startDate: '2026-11-20',
        endDate: '2026-11-22',
        status: 'Pending',
        type: 'Izin',
      },
    ];

    it('detects exact full overlap with Approved request', () => {
      const result = checkLeaveOverlap('EMP-00124', '2026-11-10', '2026-11-14', baseRequests);
      expect(result.overlaps).toBe(true);
      expect(result.conflictingId).toBe('req-A');
    });

    it('detects partial overlap starting inside an existing Approved request', () => {
      const result = checkLeaveOverlap('EMP-00124', '2026-11-12', '2026-11-16', baseRequests);
      expect(result.overlaps).toBe(true);
    });

    it('detects partial overlap ending inside an existing Approved request', () => {
      const result = checkLeaveOverlap('EMP-00124', '2026-11-08', '2026-11-11', baseRequests);
      expect(result.overlaps).toBe(true);
    });

    it('detects overlap with a Pending request', () => {
      const result = checkLeaveOverlap('EMP-00124', '2026-11-21', '2026-11-23', baseRequests);
      expect(result.overlaps).toBe(true);
      expect(result.conflictingId).toBe('req-B');
    });

    it('does not flag dates that are adjacent but not overlapping (day before start)', () => {
      const result = checkLeaveOverlap('EMP-00124', '2026-11-07', '2026-11-09', baseRequests);
      expect(result.overlaps).toBe(false);
    });

    it('does not flag dates that are adjacent but not overlapping (day after end)', () => {
      const result = checkLeaveOverlap('EMP-00124', '2026-11-15', '2026-11-18', baseRequests);
      expect(result.overlaps).toBe(false);
    });

    it('does not flag overlaps for a different employee', () => {
      const result = checkLeaveOverlap('EMP-00999', '2026-11-10', '2026-11-14', baseRequests);
      expect(result.overlaps).toBe(false);
    });

    it('ignores Rejected requests when checking overlap', () => {
      const rejected = [
        { ...baseRequests[0], status: 'Rejected' as const },
      ];
      const result = checkLeaveOverlap('EMP-00124', '2026-11-10', '2026-11-14', rejected);
      expect(result.overlaps).toBe(false);
    });

    it('ignores Cancelled requests when checking overlap', () => {
      const cancelled = [
        { ...baseRequests[0], status: 'Cancelled' as const },
      ];
      const result = checkLeaveOverlap('EMP-00124', '2026-11-10', '2026-11-14', cancelled);
      expect(result.overlaps).toBe(false);
    });

    it('returns false for empty request list', () => {
      const result = checkLeaveOverlap('EMP-00124', '2026-11-10', '2026-11-14', []);
      expect(result.overlaps).toBe(false);
    });
  });
});
