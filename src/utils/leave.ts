/**
 * Leave & Working Calendar Calculation Utilities
 */

/**
 * Calculates working days between start date and end date inclusive,
 * skipping weekends (Saturday & Sunday) and registered holidays.
 */
export function calculateWorkingDays(
  startDateStr: string,
  endDateStr: string,
  holidayDates: string[] = []
): { workingDays: number; totalCalendarDays: number; weekendDays: number; holidayDays: number } {
  if (!startDateStr || !endDateStr) {
    return { workingDays: 0, totalCalendarDays: 0, weekendDays: 0, holidayDays: 0 };
  }

  const start = new Date(startDateStr);
  const end = new Date(endDateStr);

  // Normalize hours to prevent timezone shift errors
  start.setHours(0, 0, 0, 0);
  end.setHours(0, 0, 0, 0);

  if (start.getTime() > end.getTime()) {
    return { workingDays: 0, totalCalendarDays: 0, weekendDays: 0, holidayDays: 0 };
  }

  const holidaySet = new Set(
    holidayDates.map((h) => {
      const d = new Date(h);
      d.setHours(0, 0, 0, 0);
      return d.getTime();
    })
  );

  let current = new Date(start);
  let totalCalendarDays = 0;
  let workingDays = 0;
  let weekendDays = 0;
  let holidayDays = 0;

  while (current.getTime() <= end.getTime()) {
    totalCalendarDays++;
    const dayOfWeek = current.getDay(); // 0 = Sunday, 6 = Saturday

    if (dayOfWeek === 0 || dayOfWeek === 6) {
      weekendDays++;
    } else if (holidaySet.has(current.getTime())) {
      holidayDays++;
    } else {
      workingDays++;
    }

    current.setDate(current.getDate() + 1);
  }

  return {
    workingDays,
    totalCalendarDays,
    weekendDays,
    holidayDays,
  };
}

/**
 * Validates leave application against remaining balance (BR-LEAVE-002)
 */
export function validateLeaveApplication(
  requestedDays: number,
  remainingBalance: number
): { valid: boolean; reason?: string } {
  if (requestedDays <= 0) {
    return { valid: false, reason: 'Durasi cuti minimal 1 hari kerja.' };
  }
  if (requestedDays > remainingBalance) {
    return {
      valid: false,
      reason: `Sisa kuota cuti (${remainingBalance} hari) tidak mencukupi untuk permohonan ${requestedDays} hari kerja.`,
    };
  }
  return { valid: true };
}

/**
 * Validates self-approval prevention (BR-APP-001)
 */
export function canApproveRequest(
  approverEmployeeId: string | undefined,
  requesterEmployeeId: string | undefined
): { allowed: boolean; reason?: string } {
  if (!approverEmployeeId || !requesterEmployeeId) {
    return { allowed: false, reason: 'Identitas pemohon atau approver tidak valid.' };
  }
  if (approverEmployeeId === requesterEmployeeId) {
    return {
      allowed: false,
      reason: 'Self-Approval Dilarang: Anda tidak dapat menyetujui pengajuan milik sendiri.',
    };
  }
  return { allowed: true };
}

/**
 * Calculates updated leave balance after deduction (BR-LEAVE-001)
 */
export function calculateLeaveDeduction(
  currentBalance: { total: number; used: number; remaining: number; pending?: number },
  daysToDeduct: number
): { remaining: number; used: number } {
  const newRemaining = Math.max(0, currentBalance.remaining - daysToDeduct);
  const newUsed = currentBalance.used + daysToDeduct;
  return {
    remaining: newRemaining,
    used: newUsed,
  };
}

/**
 * Checks whether a new leave request overlaps with existing active requests (BR-LEAVE-003).
 *
 * "Active" means status is Pending or Approved.
 * Overlap: [newStart, newEnd] intersects [existingStart, existingEnd].
 *
 * @returns `{ overlaps: false }` when safe, or `{ overlaps: true, conflictingId, conflictingRange }` when blocked.
 */
export function checkLeaveOverlap(
  employeeId: string,
  newStartDate: string,
  newEndDate: string,
  existingRequests: Array<{
    id: string;
    employeeId: string;
    startDate: string;
    endDate: string;
    status: string;
    type: string;
  }>
): { overlaps: boolean; conflictingId?: string; conflictingRange?: string; conflictingType?: string } {
  if (!newStartDate || !newEndDate) {
    return { overlaps: false };
  }

  const newStart = new Date(newStartDate);
  const newEnd = new Date(newEndDate);
  newStart.setHours(0, 0, 0, 0);
  newEnd.setHours(0, 0, 0, 0);

  const activeStatuses = new Set(['Pending', 'Approved']);

  for (const req of existingRequests) {
    if (req.employeeId !== employeeId) continue;
    if (!activeStatuses.has(req.status)) continue;

    const existStart = new Date(req.startDate);
    const existEnd = new Date(req.endDate);
    existStart.setHours(0, 0, 0, 0);
    existEnd.setHours(0, 0, 0, 0);

    // Overlap when: newStart <= existEnd AND newEnd >= existStart
    if (newStart <= existEnd && newEnd >= existStart) {
      return {
        overlaps: true,
        conflictingId: req.id,
        conflictingRange: `${req.startDate} s/d ${req.endDate}`,
        conflictingType: req.type,
      };
    }
  }

  return { overlaps: false };
}

