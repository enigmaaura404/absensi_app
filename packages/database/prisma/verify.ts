/**
 * Database Verification Script
 * Ensures all critical tables are seeded and data integrity holds.
 * Run: pnpm db:verify
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface VerificationResult {
  check: string;
  status: 'PASS' | 'FAIL' | 'WARN';
  detail: string;
}

async function runVerification(): Promise<void> {
  const results: VerificationResult[] = [];

  console.log('🔍 Running database verification...\n');

  // ── 1. Core tables populated ──────────────────────────────────────────────────

  const userCount = await prisma.user.count();
  results.push({
    check: 'Users seeded',
    status: userCount >= 6 ? 'PASS' : 'FAIL',
    detail: `${userCount} users found (minimum: 6)`,
  });

  const empCount = await prisma.employee.count();
  results.push({
    check: 'Employees seeded',
    status: empCount >= 6 ? 'PASS' : 'FAIL',
    detail: `${empCount} employees found (minimum: 6)`,
  });

  const roleCount = await prisma.role.count();
  results.push({
    check: 'Roles seeded',
    status: roleCount === 6 ? 'PASS' : 'WARN',
    detail: `${roleCount} roles found (expected: 6)`,
  });

  const permCount = await prisma.permission.count();
  results.push({
    check: 'Permissions seeded',
    status: permCount >= 20 ? 'PASS' : 'WARN',
    detail: `${permCount} permissions found (minimum: 20)`,
  });

  const deptCount = await prisma.department.count();
  results.push({
    check: 'Departments seeded',
    status: deptCount >= 3 ? 'PASS' : 'FAIL',
    detail: `${deptCount} departments found (minimum: 3)`,
  });

  const shiftCount = await prisma.shift.count();
  results.push({
    check: 'Shifts seeded',
    status: shiftCount >= 1 ? 'PASS' : 'FAIL',
    detail: `${shiftCount} shifts found (minimum: 1)`,
  });

  const officeCount = await prisma.officeLocation.count();
  results.push({
    check: 'Office locations seeded',
    status: officeCount >= 1 ? 'PASS' : 'FAIL',
    detail: `${officeCount} office locations found (minimum: 1)`,
  });

  const holidayCount = await prisma.holiday.count();
  results.push({
    check: 'Holidays seeded',
    status: holidayCount >= 1 ? 'PASS' : 'WARN',
    detail: `${holidayCount} holidays found`,
  });

  const settingsCount = await prisma.systemSetting.count();
  results.push({
    check: 'System settings seeded',
    status: settingsCount >= 5 ? 'PASS' : 'WARN',
    detail: `${settingsCount} settings found (minimum: 5)`,
  });

  // ── 2. Attendance records exist ──────────────────────────────────────────────

  const attCount = await prisma.attendance.count();
  results.push({
    check: 'Historical attendance records',
    status: attCount >= 10 ? 'PASS' : 'WARN',
    detail: `${attCount} attendance records found`,
  });

  // ── 3. Authentication integrity ──────────────────────────────────────────────

  const superadmin = await prisma.user.findFirst({
    where: { email: 'andi.wijaya@company.id' },
    include: {
      employee: {
        include: {
          userRoles: { include: { role: true } },
        },
      },
    },
  });

  results.push({
    check: 'Superadmin user exists',
    status: superadmin ? 'PASS' : 'FAIL',
    detail: superadmin ? `Found: ${superadmin.email}` : 'Superadmin not found',
  });

  if (superadmin?.employee) {
    const hasSuperadminRole = superadmin.employee.userRoles.some(
      (ur) => ur.role.name === 'superadmin',
    );
    results.push({
      check: 'Superadmin has correct role',
      status: hasSuperadminRole ? 'PASS' : 'FAIL',
      detail: hasSuperadminRole ? 'Role: superadmin' : 'Role assignment missing',
    });
  }

  // ── 4. Role-Permission linkage ────────────────────────────────────────────────

  const rolePermCount = await prisma.rolePermission.count();
  results.push({
    check: 'Role-permission assignments',
    status: rolePermCount >= 20 ? 'PASS' : 'WARN',
    detail: `${rolePermCount} role-permission links`,
  });

  // ── 5. Leave balances ─────────────────────────────────────────────────────────

  const leaveBalCount = await prisma.leaveBalance.count();
  results.push({
    check: 'Leave balances seeded',
    status: leaveBalCount >= empCount ? 'PASS' : 'WARN',
    detail: `${leaveBalCount} leave balances (employees: ${empCount})`,
  });

  // ── 6. Device records ─────────────────────────────────────────────────────────

  const deviceCount = await prisma.device.count();
  results.push({
    check: 'Devices seeded',
    status: deviceCount >= 1 ? 'PASS' : 'WARN',
    detail: `${deviceCount} devices found`,
  });

  // ── Print results ──────────────────────────────────────────────────────────────

  const passList = results.filter((r) => r.status === 'PASS');
  const warnList = results.filter((r) => r.status === 'WARN');
  const failList = results.filter((r) => r.status === 'FAIL');

  for (const r of results) {
    const icon = r.status === 'PASS' ? '✅' : r.status === 'WARN' ? '⚠️ ' : '❌';
    console.log(`  ${icon} [${r.status}] ${r.check}: ${r.detail}`);
  }

  console.log('\n──────────────────────────────────────');
  console.log(`  PASS: ${passList.length}  |  WARN: ${warnList.length}  |  FAIL: ${failList.length}`);
  console.log('──────────────────────────────────────\n');

  if (failList.length > 0) {
    console.error('❌ Verification FAILED. Run `pnpm db:seed` to fix missing data.\n');
    process.exit(1);
  }

  if (warnList.length > 0) {
    console.warn('⚠️  Verification passed with warnings. Consider running `pnpm db:seed`.\n');
  } else {
    console.log('✅ All checks passed. Database is ready.\n');
  }
}

runVerification()
  .catch((e) => {
    console.error('Fatal verification error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
