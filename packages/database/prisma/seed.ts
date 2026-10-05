/**
 * @absensi/database — Prisma Seed
 * Idempotent seed using upsert with stable IDs.
 * Reference date: 2026-10-03 (Saturday)
 *
 * Data is SYNTHETIC and fictional — not real personal data.
 */

import { PrismaClient } from '@prisma/client';
import * as crypto from 'crypto';

const prisma = new PrismaClient({ log: ['warn', 'error'] });

// ─── Helpers ──────────────────────────────────────────────────────────────────

function hashPassword(plain: string): string {
  // Simple hash for dev seed. In production use bcrypt.
  return crypto.createHash('sha256').update(plain).digest('hex');
}

/** Parse "HH:mm" time and return Date on given YYYY-MM-DD */
function makeDateTime(date: string, time: string): Date {
  return new Date(`${date}T${time}:00+07:00`);
}

/** Add days to a YYYY-MM-DD string */
function addDays(date: string, days: number): string {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d.toISOString().split('T')[0];
}

/** Check if a date is a weekend (Saturday/Sunday) */
function isWeekend(date: string): boolean {
  const d = new Date(date);
  const dow = d.getDay();
  return dow === 0 || dow === 6;
}

// ─── Stable IDs (prevents duplicates on re-seed) ──────────────────────────────

const IDS = {
  // Departments
  dept: {
    tech: 'dept-technology',
    hr: 'dept-hr',
    finance: 'dept-finance',
    ops: 'dept-operations',
    marketing: 'dept-marketing',
  },
  // Positions
  pos: {
    swe: 'pos-software-engineer',
    sswe: 'pos-senior-software-engineer',
    hrSpecialist: 'pos-hr-specialist',
    hrHead: 'pos-hr-head',
    finOfficer: 'pos-finance-officer',
    opsStaff: 'pos-ops-staff',
    mktSpecialist: 'pos-marketing-specialist',
    supervisor: 'pos-supervisor',
    manager: 'pos-manager',
    cto: 'pos-cto',
  },
  // Users (User accounts)
  usr: {
    budi: 'usr-budi-santoso',
    ahmad: 'usr-ahmad-fauzi',
    siti: 'usr-siti-rahma',
    andi: 'usr-andi-wijaya',
    dewi: 'usr-dewi-anggraini',
    rizky: 'usr-rizky-pratama',
    fajar: 'usr-fajar-nugraha',
    maya: 'usr-maya-putri',
    rina: 'usr-rina-lestari',
    arif: 'usr-arif-hidayat',
    nadia: 'usr-nadia-permata',
    yoga: 'usr-yoga-pranata',
    tri: 'usr-tri-mulyadi',
    hendra: 'usr-hendra-gunawan',
    bambang: 'usr-bambang-soediro',
  },
  // Employees
  emp: {
    budi: 'emp-budi-santoso',
    ahmad: 'emp-ahmad-fauzi',
    siti: 'emp-siti-rahma',
    andi: 'emp-andi-wijaya',
    dewi: 'emp-dewi-anggraini',
    rizky: 'emp-rizky-pratama',
    fajar: 'emp-fajar-nugraha',
    maya: 'emp-maya-putri',
    rina: 'emp-rina-lestari',
    arif: 'emp-arif-hidayat',
    nadia: 'emp-nadia-permata',
    yoga: 'emp-yoga-pranata',
    tri: 'emp-tri-mulyadi',
    hendra: 'emp-hendra-gunawan',
    bambang: 'emp-bambang-soediro',
  },
  // Roles
  role: {
    employee: 'role-employee',
    supervisor: 'role-supervisor',
    manager: 'role-manager',
    hr: 'role-hr',
    admin: 'role-admin',
    superadmin: 'role-superadmin',
  },
  // Shifts
  shift: {
    regular: 'shift-regular',
    morning: 'shift-morning',
    evening: 'shift-evening',
    night: 'shift-night',
  },
  // Schedules
  schedule: {
    regular: 'schedule-regular-office',
    morning: 'schedule-morning-shift',
    evening: 'schedule-evening-shift',
  },
  // Office Locations
  office: {
    bandung: 'office-bandung-pusat',
    jakarta: 'office-jakarta-selatan',
  },
  // Leave Types
  leaveType: {
    annual: 'leave-type-annual',
    sick: 'leave-type-sick',
    permission: 'leave-type-permission',
    maternity: 'leave-type-maternity',
    special: 'leave-type-special',
  },
};

// ─── Main Seed ────────────────────────────────────────────────────────────────

async function main() {
  console.log('🌱 Starting database seed...');

  // 1. DEPARTMENTS
  console.log('  → Seeding departments...');
  await prisma.department.upsert({ where: { id: IDS.dept.tech }, update: {}, create: { id: IDS.dept.tech, name: 'Technology', description: 'Software Engineering & IT' } });
  await prisma.department.upsert({ where: { id: IDS.dept.hr }, update: {}, create: { id: IDS.dept.hr, name: 'Human Resources', description: 'People & Culture Operations' } });
  await prisma.department.upsert({ where: { id: IDS.dept.finance }, update: {}, create: { id: IDS.dept.finance, name: 'Finance', description: 'Financial Planning & Control' } });
  await prisma.department.upsert({ where: { id: IDS.dept.ops }, update: {}, create: { id: IDS.dept.ops, name: 'Operations', description: 'Operational Excellence' } });
  await prisma.department.upsert({ where: { id: IDS.dept.marketing }, update: {}, create: { id: IDS.dept.marketing, name: 'Marketing', description: 'Brand & Growth Marketing' } });

  // 2. POSITIONS
  console.log('  → Seeding positions...');
  const positions = [
    { id: IDS.pos.swe, name: 'Software Engineer', level: 1 },
    { id: IDS.pos.sswe, name: 'Senior Software Engineer', level: 2 },
    { id: IDS.pos.hrSpecialist, name: 'HR Specialist', level: 1 },
    { id: IDS.pos.hrHead, name: 'Head of People & Culture', level: 4 },
    { id: IDS.pos.finOfficer, name: 'Finance Officer', level: 1 },
    { id: IDS.pos.opsStaff, name: 'Operations Staff', level: 1 },
    { id: IDS.pos.mktSpecialist, name: 'Marketing Specialist', level: 1 },
    { id: IDS.pos.supervisor, name: 'Supervisor', level: 3 },
    { id: IDS.pos.manager, name: 'Manager', level: 4 },
    { id: IDS.pos.cto, name: 'Chief Technology Officer', level: 5 },
  ];
  for (const pos of positions) {
    await prisma.position.upsert({ where: { id: pos.id }, update: {}, create: pos });
  }

  // 3. ROLES & PERMISSIONS
  console.log('  → Seeding roles & permissions...');
  const permissions = [
    { code: 'attendance.view', name: 'View Attendance', module: 'attendance' },
    { code: 'attendance.create', name: 'Check-In', module: 'attendance' },
    { code: 'attendance.checkout', name: 'Check-Out', module: 'attendance' },
    { code: 'attendance.history', name: 'View History', module: 'attendance' },
    { code: 'attendance.admin', name: 'Manage All Attendance', module: 'attendance' },
    { code: 'request.view', name: 'View Own Requests', module: 'request' },
    { code: 'request.create', name: 'Create Request', module: 'request' },
    { code: 'request.cancel', name: 'Cancel Own Request', module: 'request' },
    { code: 'request.viewAll', name: 'View All Requests', module: 'request' },
    { code: 'request.approve', name: 'Approve Request', module: 'request' },
    { code: 'request.reject', name: 'Reject Request', module: 'request' },
    { code: 'employee.view', name: 'View Employees', module: 'employee' },
    { code: 'employee.create', name: 'Create Employee', module: 'employee' },
    { code: 'employee.update', name: 'Update Employee', module: 'employee' },
    { code: 'employee.delete', name: 'Delete/Disable Employee', module: 'employee' },
    { code: 'report.view', name: 'View Reports', module: 'report' },
    { code: 'report.export', name: 'Export Reports', module: 'report' },
    { code: 'audit.view', name: 'View Audit Logs', module: 'audit' },
    { code: 'security.view', name: 'View Security Events', module: 'security' },
    { code: 'device.view', name: 'View Devices', module: 'device' },
    { code: 'device.manage', name: 'Manage Devices', module: 'device' },
    { code: 'holiday.view', name: 'View Holidays', module: 'holiday' },
    { code: 'holiday.manage', name: 'Manage Holidays', module: 'holiday' },
    { code: 'geofence.manage', name: 'Manage Geofences', module: 'geofence' },
    { code: 'roles.manage', name: 'Manage Roles', module: 'system' },
    { code: 'system.manage', name: 'Manage System Settings', module: 'system' },
    { code: 'system.integration.manage', name: 'Manage External Integrations', module: 'system' },
    { code: 'team.view', name: 'View Team', module: 'team' },
    { code: 'team.approve', name: 'Approve Team Requests', module: 'team' },
  ];

  const permMap: Record<string, string> = {};
  for (const p of permissions) {
    const perm = await prisma.permission.upsert({
      where: { code: p.code },
      update: {},
      create: { ...p },
    });
    permMap[p.code] = perm.id;
  }

  const roleDefinitions = [
    {
      id: IDS.role.employee,
      name: 'employee',
      displayName: 'Employee',
      isSystem: true,
      perms: ['attendance.view', 'attendance.create', 'attendance.checkout', 'attendance.history',
              'request.view', 'request.create', 'request.cancel', 'holiday.view', 'device.view'],
    },
    {
      id: IDS.role.supervisor,
      name: 'supervisor',
      displayName: 'Supervisor',
      isSystem: true,
      perms: ['attendance.view', 'attendance.create', 'attendance.checkout', 'attendance.history',
              'request.view', 'request.create', 'request.cancel', 'request.viewAll', 'request.approve', 'request.reject',
              'holiday.view', 'device.view', 'team.view', 'team.approve', 'report.view'],
    },
    {
      id: IDS.role.manager,
      name: 'manager',
      displayName: 'Manager',
      isSystem: true,
      perms: ['attendance.view', 'attendance.create', 'attendance.checkout', 'attendance.history',
              'request.view', 'request.create', 'request.cancel', 'request.viewAll', 'request.approve', 'request.reject',
              'employee.view', 'holiday.view', 'device.view', 'team.view', 'team.approve',
              'report.view', 'report.export'],
    },
    {
      id: IDS.role.hr,
      name: 'hr',
      displayName: 'HR',
      isSystem: true,
      perms: ['attendance.view', 'attendance.create', 'attendance.checkout', 'attendance.history', 'attendance.admin',
              'request.view', 'request.create', 'request.cancel', 'request.viewAll', 'request.approve', 'request.reject',
              'employee.view', 'employee.create', 'employee.update',
              'holiday.view', 'holiday.manage', 'device.view', 'team.view', 'team.approve',
              'report.view', 'report.export', 'audit.view'],
    },
    {
      id: IDS.role.admin,
      name: 'admin',
      displayName: 'Admin',
      isSystem: true,
      perms: ['attendance.view', 'attendance.create', 'attendance.checkout', 'attendance.history', 'attendance.admin',
              'request.view', 'request.create', 'request.cancel', 'request.viewAll', 'request.approve', 'request.reject',
              'employee.view', 'employee.create', 'employee.update', 'employee.delete',
              'holiday.view', 'holiday.manage', 'device.view', 'device.manage', 'team.view', 'team.approve',
              'report.view', 'report.export', 'audit.view', 'security.view', 'geofence.manage'],
    },
    {
      id: IDS.role.superadmin,
      name: 'superadmin',
      displayName: 'Superadmin',
      isSystem: true,
      perms: permissions.map((p) => p.code),
    },
  ];

  for (const roleDef of roleDefinitions) {
    await prisma.role.upsert({
      where: { id: roleDef.id },
      update: {},
      create: { id: roleDef.id, name: roleDef.name, displayName: roleDef.displayName, isSystem: roleDef.isSystem },
    });
    for (const permCode of roleDef.perms) {
      const permId = permMap[permCode];
      if (permId) {
        await prisma.rolePermission.upsert({
          where: { roleId_permissionId: { roleId: roleDef.id, permissionId: permId } },
          update: {},
          create: { roleId: roleDef.id, permissionId: permId },
        });
      }
    }
  }

  // 4. SHIFTS
  console.log('  → Seeding shifts...');
  const shifts = [
    { id: IDS.shift.regular, name: 'Regular Office', code: 'REG', startTime: '08:00', endTime: '17:00', gracePeriodMinutes: 10, breakStartTime: '12:00', breakEndTime: '13:00' },
    { id: IDS.shift.morning, name: 'Morning Shift', code: 'MRN', startTime: '06:00', endTime: '14:00', gracePeriodMinutes: 10 },
    { id: IDS.shift.evening, name: 'Evening Shift', code: 'EVN', startTime: '14:00', endTime: '22:00', gracePeriodMinutes: 10 },
    { id: IDS.shift.night, name: 'Night Shift', code: 'NGT', startTime: '22:00', endTime: '06:00', gracePeriodMinutes: 10, isOvernight: true },
  ];
  for (const s of shifts) {
    await prisma.shift.upsert({ where: { id: s.id }, update: {}, create: s });
  }

  // 5. SCHEDULES
  console.log('  → Seeding schedules...');
  await prisma.schedule.upsert({
    where: { id: IDS.schedule.regular },
    update: {},
    create: { id: IDS.schedule.regular, name: 'Regular Office', description: 'Monday - Friday, 08:00 - 17:00', isDefault: true },
  });
  await prisma.schedule.upsert({
    where: { id: IDS.schedule.morning },
    update: {},
    create: { id: IDS.schedule.morning, name: 'Morning Shift', description: 'Monday - Saturday, 06:00 - 14:00' },
  });
  await prisma.schedule.upsert({
    where: { id: IDS.schedule.evening },
    update: {},
    create: { id: IDS.schedule.evening, name: 'Evening Shift', description: 'Monday - Saturday, 14:00 - 22:00' },
  });

  // Schedule days for Regular (Mon=1 to Fri=5)
  for (let day = 1; day <= 5; day++) {
    await prisma.scheduleDay.upsert({
      where: { scheduleId_dayOfWeek: { scheduleId: IDS.schedule.regular, dayOfWeek: day } },
      update: {},
      create: { scheduleId: IDS.schedule.regular, dayOfWeek: day, shiftId: IDS.shift.regular },
    });
  }
  // Morning shift: Mon-Sat (1-6)
  for (let day = 1; day <= 6; day++) {
    await prisma.scheduleDay.upsert({
      where: { scheduleId_dayOfWeek: { scheduleId: IDS.schedule.morning, dayOfWeek: day } },
      update: {},
      create: { scheduleId: IDS.schedule.morning, dayOfWeek: day, shiftId: IDS.shift.morning },
    });
  }

  // 6. OFFICE LOCATIONS
  console.log('  → Seeding office locations...');
  await prisma.officeLocation.upsert({
    where: { id: IDS.office.bandung },
    update: {},
    create: {
      id: IDS.office.bandung,
      name: 'Kantor Pusat Bandung',
      address: 'Jl. Asia Afrika No. 45, Gedung Graha Mandiri Lt. 8',
      city: 'Bandung',
      latitude: -6.917464,
      longitude: 107.619123,
      radiusMeters: 100,
      accuracyLimitMeters: 50,
    },
  });
  await prisma.officeLocation.upsert({
    where: { id: IDS.office.jakarta },
    update: {},
    create: {
      id: IDS.office.jakarta,
      name: 'Kantor Cabang Jakarta',
      address: 'Jl. Jenderal Sudirman Kav. 25, Menara Sentraya Lt. 14',
      city: 'Jakarta Selatan',
      latitude: -6.208763,
      longitude: 106.845599,
      radiusMeters: 80,
      accuracyLimitMeters: 50,
    },
  });

  // 7. HOLIDAYS (Seed realistic 2026 sample - clearly demo data)
  console.log('  → Seeding holidays...');
  const holidays = [
    { name: 'Hari Kesaktian Pancasila', date: '2026-10-01', type: 'NATIONAL', description: 'Peringatan Hari Kesaktian Pancasila' },
    { name: 'HUT PT Teknologi Absensi Mandiri', date: '2026-10-24', type: 'COMPANY', description: 'Libur internal HUT perusahaan ke-6' },
    { name: 'Hari Pahlawan Nasional', date: '2026-11-10', type: 'NATIONAL', description: 'Peringatan Hari Pahlawan' },
    { name: 'Cuti Bersama Natal', date: '2026-12-24', type: 'NATIONAL', description: 'Cuti bersama Hari Raya Natal (Demo Data)' },
    { name: 'Hari Raya Natal', date: '2026-12-25', type: 'NATIONAL', description: 'Hari Raya Natal (Demo Data)' },
    { name: 'Tahun Baru 2027', date: '2027-01-01', type: 'NATIONAL', description: 'Libur Nasional Tahun Baru (Demo Data)' },
    { name: 'Hari Merdeka RI', date: '2026-08-17', type: 'NATIONAL', description: 'Hari Kemerdekaan Republik Indonesia (Demo Data)' },
  ];
  for (const h of holidays) {
    await prisma.holiday.upsert({
      where: { date_type: { date: h.date, type: h.type } },
      update: {},
      create: h,
    });
  }

  // 8. LEAVE TYPES
  console.log('  → Seeding leave types...');
  const leaveTypes = [
    { id: IDS.leaveType.annual, code: 'ANNUAL', name: 'Cuti Tahunan', annualQuota: 12 },
    { id: IDS.leaveType.sick, code: 'SICK', name: 'Cuti Sakit', annualQuota: 12 },
    { id: IDS.leaveType.permission, code: 'PERMISSION', name: 'Izin', annualQuota: 6 },
    { id: IDS.leaveType.maternity, code: 'MATERNITY', name: 'Cuti Melahirkan', annualQuota: 90 },
    { id: IDS.leaveType.special, code: 'SPECIAL', name: 'Cuti Khusus', annualQuota: 3, requiresDoc: true },
  ];
  for (const lt of leaveTypes) {
    await prisma.leaveType.upsert({ where: { id: lt.id }, update: {}, create: lt });
  }

  // 9. USERS + EMPLOYEES
  console.log('  → Seeding users & employees...');

  const employeeData = [
    {
      userId: IDS.usr.andi, empId: IDS.emp.andi,
      email: 'andi.wijaya@company.id', password: 'Superadmin123!',
      name: 'Andi Wijaya, M.Kom', employeeNumber: 'EMP-00001',
      deptId: IDS.dept.tech, posId: IDS.pos.cto, supervisorId: null,
      joinedAt: new Date('2020-01-01'), status: 'ACTIVE',
      role: IDS.role.superadmin,
    },
    {
      userId: IDS.usr.siti, empId: IDS.emp.siti,
      email: 'siti.rahma@company.id', password: 'HR123!',
      name: 'Siti Rahma', employeeNumber: 'EMP-00018',
      deptId: IDS.dept.hr, posId: IDS.pos.hrHead, supervisorId: IDS.emp.andi,
      joinedAt: new Date('2022-03-01'), status: 'ACTIVE',
      role: IDS.role.hr,
    },
    {
      userId: IDS.usr.bambang, empId: IDS.emp.bambang,
      email: 'bambang.s@company.id', password: 'Admin123!',
      name: 'Bambang Soediro', employeeNumber: 'EMP-00005',
      deptId: IDS.dept.ops, posId: IDS.pos.manager, supervisorId: IDS.emp.andi,
      joinedAt: new Date('2019-06-15'), status: 'ACTIVE',
      role: IDS.role.admin,
    },
    {
      userId: IDS.usr.tri, empId: IDS.emp.tri,
      email: 'tri.mulyadi@company.id', password: 'Manager123!',
      name: 'Tri Mulyadi', employeeNumber: 'EMP-00128',
      deptId: IDS.dept.tech, posId: IDS.pos.manager, supervisorId: IDS.emp.andi,
      joinedAt: new Date('2021-05-05'), status: 'ACTIVE',
      role: IDS.role.manager,
    },
    {
      userId: IDS.usr.ahmad, empId: IDS.emp.ahmad,
      email: 'ahmad.fauzi@company.id', password: 'Supervisor123!',
      name: 'Ahmad Fauzi, S.T.', employeeNumber: 'EMP-00045',
      deptId: IDS.dept.tech, posId: IDS.pos.supervisor, supervisorId: IDS.emp.tri,
      joinedAt: new Date('2021-08-12'), status: 'ACTIVE',
      role: IDS.role.supervisor,
    },
    {
      userId: IDS.usr.budi, empId: IDS.emp.budi,
      email: 'budi.santoso@company.id', password: 'Employee123!',
      name: 'Budi Santoso', employeeNumber: 'EMP-00124',
      deptId: IDS.dept.tech, posId: IDS.pos.sswe, supervisorId: IDS.emp.ahmad,
      joinedAt: new Date('2024-01-12'), status: 'ACTIVE',
      role: IDS.role.employee,
    },
    {
      userId: IDS.usr.dewi, empId: IDS.emp.dewi,
      email: 'dewi.anggraini@company.id', password: 'Employee123!',
      name: 'Dewi Anggraini', employeeNumber: 'EMP-00125',
      deptId: IDS.dept.finance, posId: IDS.pos.finOfficer, supervisorId: IDS.emp.bambang,
      joinedAt: new Date('2023-07-15'), status: 'ACTIVE',
      role: IDS.role.employee,
    },
    {
      userId: IDS.usr.rizky, empId: IDS.emp.rizky,
      email: 'rizky.pratama@company.id', password: 'Employee123!',
      name: 'Rizky Pratama', employeeNumber: 'EMP-00126',
      deptId: IDS.dept.ops, posId: IDS.pos.opsStaff, supervisorId: IDS.emp.bambang,
      joinedAt: new Date('2024-02-10'), status: 'ACTIVE',
      role: IDS.role.employee,
    },
    {
      userId: IDS.usr.nadia, empId: IDS.emp.nadia,
      email: 'nadia.permata@company.id', password: 'Employee123!',
      name: 'Nadia Permata', employeeNumber: 'EMP-00127',
      deptId: IDS.dept.marketing, posId: IDS.pos.mktSpecialist, supervisorId: IDS.emp.bambang,
      joinedAt: new Date('2023-08-01'), status: 'ACTIVE',
      role: IDS.role.employee,
    },
    {
      userId: IDS.usr.fajar, empId: IDS.emp.fajar,
      email: 'fajar.nugraha@company.id', password: 'Employee123!',
      name: 'Fajar Nugraha', employeeNumber: 'EMP-00130',
      deptId: IDS.dept.tech, posId: IDS.pos.swe, supervisorId: IDS.emp.ahmad,
      joinedAt: new Date('2024-03-01'), status: 'ACTIVE',
      role: IDS.role.employee,
    },
    {
      userId: IDS.usr.maya, empId: IDS.emp.maya,
      email: 'maya.putri@company.id', password: 'Employee123!',
      name: 'Maya Putri', employeeNumber: 'EMP-00131',
      deptId: IDS.dept.hr, posId: IDS.pos.hrSpecialist, supervisorId: IDS.emp.siti,
      joinedAt: new Date('2023-11-01'), status: 'ACTIVE',
      role: IDS.role.employee,
    },
    {
      userId: IDS.usr.rina, empId: IDS.emp.rina,
      email: 'rina.lestari@company.id', password: 'Employee123!',
      name: 'Rina Lestari', employeeNumber: 'EMP-00132',
      deptId: IDS.dept.finance, posId: IDS.pos.finOfficer, supervisorId: IDS.emp.bambang,
      joinedAt: new Date('2023-05-15'), status: 'ON_LEAVE',
      role: IDS.role.employee,
    },
    {
      userId: IDS.usr.arif, empId: IDS.emp.arif,
      email: 'arif.hidayat@company.id', password: 'Employee123!',
      name: 'Arif Hidayat', employeeNumber: 'EMP-00133',
      deptId: IDS.dept.ops, posId: IDS.pos.opsStaff, supervisorId: IDS.emp.bambang,
      joinedAt: new Date('2022-09-01'), status: 'ACTIVE',
      role: IDS.role.employee,
    },
    {
      userId: IDS.usr.yoga, empId: IDS.emp.yoga,
      email: 'yoga.pranata@company.id', password: 'Employee123!',
      name: 'Yoga Pranata', employeeNumber: 'EMP-00134',
      deptId: IDS.dept.marketing, posId: IDS.pos.mktSpecialist, supervisorId: IDS.emp.bambang,
      joinedAt: new Date('2024-05-01'), status: 'ACTIVE',
      role: IDS.role.employee,
    },
    {
      userId: IDS.usr.hendra, empId: IDS.emp.hendra,
      email: 'hendra.gunawan@company.id', password: 'Employee123!',
      name: 'Hendra Gunawan', employeeNumber: 'EMP-00129',
      deptId: IDS.dept.ops, posId: IDS.pos.opsStaff, supervisorId: IDS.emp.bambang,
      joinedAt: new Date('2023-09-20'), status: 'INACTIVE',
      role: IDS.role.employee,
    },
  ];

  for (const emp of employeeData) {
    // Upsert User
    await prisma.user.upsert({
      where: { id: emp.userId },
      update: {},
      create: {
        id: emp.userId,
        email: emp.email,
        passwordHash: hashPassword(emp.password),
        status: 'ACTIVE',
      },
    });

    // Upsert Employee (skip supervisor self-ref on first pass)
    await prisma.employee.upsert({
      where: { id: emp.empId },
      update: {},
      create: {
        id: emp.empId,
        employeeNumber: emp.employeeNumber,
        userId: emp.userId,
        name: emp.name,
        departmentId: emp.deptId,
        positionId: emp.posId,
        joinedAt: emp.joinedAt,
        status: emp.status,
      },
    });
  }

  // Second pass: set supervisor IDs (all employees exist now)
  for (const emp of employeeData) {
    if (emp.supervisorId) {
      await prisma.employee.update({
        where: { id: emp.empId },
        data: { supervisorId: emp.supervisorId },
      });
    }
  }

  // Assign roles to employees
  for (const emp of employeeData) {
    await prisma.userRole.upsert({
      where: { employeeId_roleId: { employeeId: emp.empId, roleId: emp.role } },
      update: {},
      create: { employeeId: emp.empId, roleId: emp.role },
    });
  }

  // 10. SCHEDULE ASSIGNMENTS
  console.log('  → Seeding schedule assignments...');
  const effectiveFrom = new Date('2024-01-01');
  for (const emp of employeeData) {
    await prisma.scheduleAssignment.upsert({
      where: { id: `sa-${emp.empId}` },
      update: {},
      create: {
        id: `sa-${emp.empId}`,
        employeeId: emp.empId,
        scheduleId: IDS.schedule.regular,
        effectiveFrom,
      },
    });
  }

  // 11. DEVICES
  console.log('  → Seeding devices...');
  const devices = [
    { id: 'dev-budi', empId: IDS.emp.budi, identifier: 'SM-S928B-BUDI-8241', model: 'Samsung Galaxy S24 Ultra', type: 'MOBILE', platform: 'Android', browser: 'Chrome Mobile 128', status: 'ACTIVE' },
    { id: 'dev-ahmad', empId: IDS.emp.ahmad, identifier: 'SAMSUNG-A55-AHMAD-7732', model: 'Samsung Galaxy A55', type: 'MOBILE', platform: 'Android', browser: 'Chrome Mobile', status: 'ACTIVE' },
    { id: 'dev-siti', empId: IDS.emp.siti, identifier: 'IPHONE-A3102-SITI-9901', model: 'iPhone 15 Pro', type: 'MOBILE', platform: 'iOS', browser: 'Mobile Safari 18', status: 'ACTIVE' },
    { id: 'dev-andi', empId: IDS.emp.andi, identifier: 'IPHONE-ANDI-SUPERADMIN-1001', model: 'iPhone 15 Pro Max', type: 'MOBILE', platform: 'iOS', browser: 'Mobile Safari 18', status: 'ACTIVE' },
    { id: 'dev-dewi', empId: IDS.emp.dewi, identifier: 'PC-DELL-DEWI-8832', model: 'Dell XPS 13', type: 'DESKTOP', platform: 'Windows', browser: 'Chrome 129', status: 'ACTIVE' },
    { id: 'dev-hendra', empId: IDS.emp.hendra, identifier: '2312DRA50G-HENDRA-1122', model: 'Xiaomi Redmi Note 13', type: 'MOBILE', platform: 'Android', browser: 'Chrome Mobile', status: 'BLOCKED' },
    { id: 'dev-rizky', empId: IDS.emp.rizky, identifier: 'OPPO-RIZKY-A98-5573', model: 'OPPO A98', type: 'MOBILE', platform: 'Android', browser: 'Chrome Mobile', status: 'ACTIVE' },
    { id: 'dev-nadia-old', empId: IDS.emp.nadia, identifier: 'VIVO-NADIA-OLD-3399', model: 'Vivo V29', type: 'MOBILE', platform: 'Android', browser: 'Chrome Mobile', status: 'REVOKED' },
    { id: 'dev-nadia-new', empId: IDS.emp.nadia, identifier: 'IPHONE-NADIA-14-2024', model: 'iPhone 14', type: 'MOBILE', platform: 'iOS', browser: 'Safari', status: 'ACTIVE' },
  ];
  for (const d of devices) {
    await prisma.device.upsert({
      where: { id: d.id },
      update: {},
      create: {
        id: d.id,
        employeeId: d.empId,
        deviceIdentifier: d.identifier,
        deviceModel: d.model,
        deviceType: d.type,
        platform: d.platform,
        browser: d.browser,
        status: d.status,
        registeredAt: new Date('2024-01-15'),
        lastSeenAt: d.status === 'ACTIVE' ? new Date('2026-10-02') : new Date('2026-09-01'),
      },
    });
  }

  // 12. FACE PROFILES
  console.log('  → Seeding face profiles...');
  const activeEmps = [IDS.emp.budi, IDS.emp.ahmad, IDS.emp.siti, IDS.emp.andi, IDS.emp.dewi, IDS.emp.rizky, IDS.emp.nadia, IDS.emp.tri, IDS.emp.bambang, IDS.emp.fajar, IDS.emp.maya, IDS.emp.arif, IDS.emp.yoga];
  for (const empId of activeEmps) {
    await prisma.faceProfile.upsert({
      where: { id: `fp-${empId}` },
      update: {},
      create: {
        id: `fp-${empId}`,
        employeeId: empId,
        provider: 'MOCK',
        status: 'ACTIVE',
        registeredAt: new Date('2024-01-20'),
      },
    });
  }

  // 13. LEAVE BALANCES (for current year 2026)
  console.log('  → Seeding leave balances...');
  const leaveBalanceData = [
    { empId: IDS.emp.budi, annual: { alloc: 12, used: 8, pending: 2 } },
    { empId: IDS.emp.ahmad, annual: { alloc: 14, used: 4, pending: 0 } },
    { empId: IDS.emp.siti, annual: { alloc: 14, used: 4, pending: 0 } },
    { empId: IDS.emp.andi, annual: { alloc: 15, used: 2, pending: 0 } },
    { empId: IDS.emp.dewi, annual: { alloc: 12, used: 6, pending: 1 } },
    { empId: IDS.emp.rizky, annual: { alloc: 12, used: 3, pending: 0 } },
    { empId: IDS.emp.nadia, annual: { alloc: 12, used: 5, pending: 2 } },
    { empId: IDS.emp.tri, annual: { alloc: 14, used: 4, pending: 0 } },
    { empId: IDS.emp.bambang, annual: { alloc: 14, used: 2, pending: 0 } },
    { empId: IDS.emp.fajar, annual: { alloc: 12, used: 1, pending: 0 } },
    { empId: IDS.emp.maya, annual: { alloc: 12, used: 3, pending: 1 } },
    { empId: IDS.emp.rina, annual: { alloc: 12, used: 10, pending: 2 } },
    { empId: IDS.emp.arif, annual: { alloc: 12, used: 2, pending: 0 } },
    { empId: IDS.emp.yoga, annual: { alloc: 12, used: 0, pending: 0 } },
    { empId: IDS.emp.hendra, annual: { alloc: 12, used: 8, pending: 0 } },
  ];
  for (const lb of leaveBalanceData) {
    const remaining = lb.annual.alloc - lb.annual.used - lb.annual.pending;
    await prisma.leaveBalance.upsert({
      where: { employeeId_leaveTypeId_year: { employeeId: lb.empId, leaveTypeId: IDS.leaveType.annual, year: 2026 } },
      update: {},
      create: {
        employeeId: lb.empId,
        leaveTypeId: IDS.leaveType.annual,
        year: 2026,
        allocatedDays: lb.annual.alloc,
        usedDays: lb.annual.used,
        pendingDays: lb.annual.pending,
        remainingDays: remaining,
      },
    });
  }

  // 14. HISTORICAL ATTENDANCE (30 days back from 2026-10-02)
  console.log('  → Seeding historical attendance (30 days)...');
  const REF_DATE = '2026-10-02'; // last Friday before today (2026-10-03 = Saturday)

  // Employees to seed attendance for
  const attendanceEmps = [
    { empId: IDS.emp.budi, deviceId: 'dev-budi', officeId: IDS.office.bandung, pattern: 'regular' },
    { empId: IDS.emp.ahmad, deviceId: 'dev-ahmad', officeId: IDS.office.bandung, pattern: 'regular' },
    { empId: IDS.emp.siti, deviceId: 'dev-siti', officeId: IDS.office.bandung, pattern: 'regular' },
    { empId: IDS.emp.dewi, deviceId: 'dev-dewi', officeId: IDS.office.jakarta, pattern: 'regular' },
    { empId: IDS.emp.rizky, deviceId: 'dev-rizky', officeId: IDS.office.bandung, pattern: 'regular' },
    { empId: IDS.emp.nadia, deviceId: 'dev-nadia-new', officeId: IDS.office.jakarta, pattern: 'regular' },
    { empId: IDS.emp.tri, deviceId: null, officeId: IDS.office.bandung, pattern: 'regular' },
    { empId: IDS.emp.bambang, deviceId: null, officeId: IDS.office.bandung, pattern: 'regular' },
  ];

  // Specific scenario data for today / key dates
  const specificAttendance: Record<string, Record<string, { status: string; checkIn?: string; checkOut?: string; notes?: string; lateMinutes?: number }>> = {
    // 2026-10-02 (Friday) - specific scenarios
    '2026-10-02': {
      [IDS.emp.budi]: { status: 'PRESENT', checkIn: '08:01', checkOut: undefined, notes: 'Open attendance - no check-out yet' },
      [IDS.emp.siti]: { status: 'PRESENT', checkIn: '07:48', checkOut: undefined },
      [IDS.emp.dewi]: { status: 'LATE', checkIn: '08:24', checkOut: undefined, lateMinutes: 24 },
      [IDS.emp.rizky]: { status: 'PRESENT', checkIn: '07:55', checkOut: undefined },
      [IDS.emp.nadia]: { status: 'PRESENT', checkIn: '08:05', checkOut: undefined },
      [IDS.emp.tri]: { status: 'PRESENT', checkIn: '07:50', checkOut: undefined },
      [IDS.emp.ahmad]: { status: 'PRESENT', checkIn: '08:03', checkOut: undefined },
      [IDS.emp.bambang]: { status: 'PRESENT', checkIn: '08:00', checkOut: undefined },
    },
    '2026-10-01': {
      // Hari Kesaktian Pancasila - National Holiday
      // All marked HOLIDAY - no attendance records needed
    },
    '2026-09-29': {
      [IDS.emp.budi]: { status: 'LATE', checkIn: '08:12', checkOut: '17:30', lateMinutes: 12, notes: 'Terlambat 12 menit' },
      [IDS.emp.dewi]: { status: 'PRESENT', checkIn: '07:58', checkOut: '17:05' },
    },
    '2026-09-30': {
      [IDS.emp.rina]: { status: 'LEAVE', checkIn: undefined, checkOut: undefined, notes: 'Cuti tahunan (disetujui)' },
      [IDS.emp.budi]: { status: 'PRESENT', checkIn: '07:58', checkOut: '17:15' },
    },
  };

  for (let daysAgo = 0; daysAgo <= 30; daysAgo++) {
    const workDate = addDays(REF_DATE, -daysAgo);

    // Skip weekends
    if (isWeekend(workDate)) continue;

    // Skip if holiday (Hari Kesaktian = 2026-10-01)
    const holidayDates = ['2026-10-01', '2026-08-17'];
    if (holidayDates.includes(workDate)) continue;

    for (const empConfig of attendanceEmps) {
      const attId = `att-${empConfig.empId}-${workDate}`;

      // Check if there's specific data for this date+emp
      const specific = specificAttendance[workDate]?.[empConfig.empId];

      let status = 'PRESENT';
      let checkInTime: string | undefined;
      let checkOutTime: string | undefined;
      let lateMinutes = 0;
      let notes: string | undefined;

      if (specific) {
        status = specific.status;
        checkInTime = specific.checkIn;
        checkOutTime = specific.checkOut;
        lateMinutes = specific.lateMinutes ?? 0;
        notes = specific.notes;
      } else {
        // Generate realistic pattern
        const rng = parseInt(attId.slice(-4), 36) % 100;

        if (rng < 5) {
          status = 'ABSENT';
          checkInTime = undefined;
          checkOutTime = undefined;
        } else if (rng < 12) {
          status = 'LATE';
          const lateMins = 5 + (rng % 20);
          lateMinutes = lateMins;
          checkInTime = `08:${String(lateMins).padStart(2, '0')}`;
          checkOutTime = '17:00';
        } else if (rng < 16) {
          status = 'SICK';
          checkInTime = undefined;
          checkOutTime = undefined;
        } else {
          status = 'PRESENT';
          checkInTime = rng % 3 === 0 ? '07:58' : rng % 3 === 1 ? '08:00' : '07:55';
          checkOutTime = rng % 4 === 0 ? '17:15' : rng % 4 === 1 ? '17:05' : '17:00';
        }
      }

      const checkInAt = checkInTime ? makeDateTime(workDate, checkInTime) : null;
      const checkOutAt = checkOutTime ? makeDateTime(workDate, checkOutTime) : null;
      const durationMinutes = checkInAt && checkOutAt
        ? Math.round((checkOutAt.getTime() - checkInAt.getTime()) / 60000)
        : null;

      await prisma.attendance.upsert({
        where: { id: attId },
        update: {},
        create: {
          id: attId,
          employeeId: empConfig.empId,
          workDate,
          scheduleId: IDS.schedule.regular,
          shiftId: IDS.shift.regular,
          officeLocationId: empConfig.officeId,
          deviceId: empConfig.deviceId ?? undefined,
          status,
          checkInAt: checkInAt ?? undefined,
          checkOutAt: checkOutAt ?? undefined,
          durationMinutes: durationMinutes ?? undefined,
          checkInLatitude: checkInAt ? -6.917464 : undefined,
          checkInLongitude: checkInAt ? 107.619123 : undefined,
          checkInAccuracy: checkInAt ? 12 : undefined,
          checkOutLatitude: checkOutAt ? -6.917464 : undefined,
          checkOutLongitude: checkOutAt ? 107.619123 : undefined,
          checkOutAccuracy: checkOutAt ? 15 : undefined,
          checkInIp: checkInAt ? '182.253.14.88' : undefined,
          checkOutIp: checkOutAt ? '182.253.14.88' : undefined,
          lateMinutes,
          notes,
        },
      });
    }
  }

  // 15. REQUESTS
  console.log('  → Seeding requests...');
  const requests = [
    {
      id: 'req-budi-leave-oct',
      empId: IDS.emp.budi, type: 'LEAVE', leaveTypeId: IDS.leaveType.annual,
      startDate: '2026-10-08', endDate: '2026-10-09', days: 2,
      reason: 'Keperluan keluarga di luar kota', status: 'PENDING',
      submittedAt: new Date('2026-10-02T08:20:00+07:00'),
      history: [
        { actorId: IDS.emp.budi, actorName: 'Budi Santoso', actorRole: 'employee', action: 'SUBMITTED', step: '1', note: 'Pengajuan cuti tahunan', ts: new Date('2026-10-02T08:20:00+07:00') },
      ],
    },
    {
      id: 'req-dewi-sick-oct',
      empId: IDS.emp.dewi, type: 'SICK', leaveTypeId: IDS.leaveType.sick,
      startDate: '2026-10-05', endDate: '2026-10-05', days: 1,
      reason: 'Flu berat & demam tinggi, anjuran istirahat dokter', status: 'PENDING',
      submittedAt: new Date('2026-10-02T07:15:00+07:00'),
      history: [
        { actorId: IDS.emp.dewi, actorName: 'Dewi Anggraini', actorRole: 'employee', action: 'SUBMITTED', step: '1', note: undefined, ts: new Date('2026-10-02T07:15:00+07:00') },
      ],
    },
    {
      id: 'req-nadia-biztrip',
      empId: IDS.emp.nadia, type: 'BUSINESS_TRIP', leaveTypeId: undefined,
      startDate: '2026-10-06', endDate: '2026-10-07', days: 2,
      reason: 'Narasumber pameran Tech Expo & koordinasi booth sponsor', status: 'PENDING',
      destination: 'Hotel Mulia Senayan, Jakarta',
      tripPurpose: 'Pameran Tech Expo 2026',
      submittedAt: new Date('2026-10-01T16:30:00+07:00'),
      history: [
        { actorId: IDS.emp.nadia, actorName: 'Nadia Permata', actorRole: 'employee', action: 'SUBMITTED', step: '1', note: undefined, ts: new Date('2026-10-01T16:30:00+07:00') },
      ],
    },
    {
      id: 'req-rizky-correction',
      empId: IDS.emp.rizky, type: 'CORRECTION', leaveTypeId: undefined,
      startDate: '2026-10-01', endDate: '2026-10-01', days: 1,
      reason: 'Gagal koneksi saat check-out karena gangguan jaringan gedung',
      requestedCheckIn: new Date('2026-10-01T08:00:00+07:00'),
      requestedCheckOut: new Date('2026-10-01T17:15:00+07:00'),
      status: 'PENDING',
      submittedAt: new Date('2026-10-02T08:05:00+07:00'),
      history: [
        { actorId: IDS.emp.rizky, actorName: 'Rizky Pratama', actorRole: 'employee', action: 'SUBMITTED', step: '1', note: undefined, ts: new Date('2026-10-02T08:05:00+07:00') },
      ],
    },
    {
      id: 'req-tri-permission-approved',
      empId: IDS.emp.tri, type: 'PERMISSION', leaveTypeId: IDS.leaveType.permission,
      startDate: '2026-10-05', endDate: '2026-10-05', days: 0.5,
      reason: 'Urusan perpanjangan paspor di kantor imigrasi', status: 'APPROVED',
      submittedAt: new Date('2026-09-29T11:20:00+07:00'),
      resolvedAt: new Date('2026-09-29T14:00:00+07:00'),
      history: [
        { actorId: IDS.emp.tri, actorName: 'Tri Mulyadi', actorRole: 'manager', action: 'SUBMITTED', step: '1', note: undefined, ts: new Date('2026-09-29T11:20:00+07:00') },
        { actorId: IDS.emp.siti, actorName: 'Siti Rahma', actorRole: 'hr', action: 'APPROVED', step: '2', note: 'Disetujui', ts: new Date('2026-09-29T14:00:00+07:00') },
      ],
    },
    {
      id: 'req-budi-leave-sept-approved',
      empId: IDS.emp.budi, type: 'LEAVE', leaveTypeId: IDS.leaveType.annual,
      startDate: '2026-09-15', endDate: '2026-09-16', days: 2,
      reason: 'Liburan keluarga tahunan', status: 'APPROVED',
      submittedAt: new Date('2026-09-10T09:00:00+07:00'),
      resolvedAt: new Date('2026-09-10T13:45:00+07:00'),
      history: [
        { actorId: IDS.emp.budi, actorName: 'Budi Santoso', actorRole: 'employee', action: 'SUBMITTED', step: '1', note: undefined, ts: new Date('2026-09-10T09:00:00+07:00') },
        { actorId: IDS.emp.ahmad, actorName: 'Ahmad Fauzi', actorRole: 'supervisor', action: 'APPROVED', step: '1', note: 'Disetujui', ts: new Date('2026-09-10T11:00:00+07:00') },
        { actorId: IDS.emp.siti, actorName: 'Siti Rahma', actorRole: 'hr', action: 'APPROVED', step: '2', note: 'Disetujui HR', ts: new Date('2026-09-10T13:45:00+07:00') },
      ],
    },
    {
      id: 'req-fajar-leave-rejected',
      empId: IDS.emp.fajar, type: 'LEAVE', leaveTypeId: IDS.leaveType.annual,
      startDate: '2026-09-22', endDate: '2026-09-25', days: 4,
      reason: 'Liburan ke Bali', status: 'REJECTED',
      submittedAt: new Date('2026-09-15T10:00:00+07:00'),
      resolvedAt: new Date('2026-09-15T15:00:00+07:00'),
      history: [
        { actorId: IDS.emp.fajar, actorName: 'Fajar Nugraha', actorRole: 'employee', action: 'SUBMITTED', step: '1', note: undefined, ts: new Date('2026-09-15T10:00:00+07:00') },
        { actorId: IDS.emp.ahmad, actorName: 'Ahmad Fauzi', actorRole: 'supervisor', action: 'REJECTED', step: '1', note: 'Periode sibuk sprint delivery, tidak dapat disetujui', ts: new Date('2026-09-15T15:00:00+07:00') },
      ],
    },
    {
      id: 'req-rina-leave-on-leave',
      empId: IDS.emp.rina, type: 'LEAVE', leaveTypeId: IDS.leaveType.maternity,
      startDate: '2026-08-01', endDate: '2026-11-01', days: 90,
      reason: 'Cuti melahirkan', status: 'APPROVED',
      submittedAt: new Date('2026-07-15T09:00:00+07:00'),
      resolvedAt: new Date('2026-07-16T10:00:00+07:00'),
      history: [
        { actorId: IDS.emp.rina, actorName: 'Rina Lestari', actorRole: 'employee', action: 'SUBMITTED', step: '1', note: undefined, ts: new Date('2026-07-15T09:00:00+07:00') },
        { actorId: IDS.emp.siti, actorName: 'Siti Rahma', actorRole: 'hr', action: 'APPROVED', step: '1', note: 'Hak cuti melahirkan disetujui', ts: new Date('2026-07-16T10:00:00+07:00') },
      ],
    },
  ];

  for (const req of requests) {
    await prisma.request.upsert({
      where: { id: req.id },
      update: {},
      create: {
        id: req.id,
        employeeId: req.empId,
        type: req.type,
        leaveTypeId: req.leaveTypeId,
        status: req.status,
        startDate: req.startDate,
        endDate: req.endDate,
        days: req.days,
        reason: req.reason,
        destination: (req as any).destination,
        tripPurpose: (req as any).tripPurpose,
        requestedCheckIn: (req as any).requestedCheckIn,
        requestedCheckOut: (req as any).requestedCheckOut,
        submittedAt: req.submittedAt,
        resolvedAt: req.resolvedAt,
      },
    });

    // Approval history
    if (req.history) {
      for (let i = 0; i < req.history.length; i++) {
        const h = req.history[i];
        const histId = `${req.id}-hist-${i}`;
        await prisma.approvalHistory.upsert({
          where: { id: histId },
          update: {},
          create: {
            id: histId,
            requestId: req.id,
            approverId: h.actorId,
            approverName: h.actorName,
            approverRole: h.actorRole,
            action: h.action,
            step: h.step,
            note: h.note,
            timestamp: h.ts,
          },
        });
      }
    }
  }

  // 16. SYSTEM SETTINGS
  console.log('  → Seeding system settings...');
  const settings = [
    { key: 'company.name', value: 'PT Teknologi Absensi Mandiri', type: 'string', label: 'Nama Perusahaan' },
    { key: 'attendance.grace_period_minutes', value: '10', type: 'number', label: 'Grace Period (menit)' },
    { key: 'attendance.require_selfie', value: 'true', type: 'boolean', label: 'Wajib Selfie' },
    { key: 'attendance.face_verification_enabled', value: 'true', type: 'boolean', label: 'Face Verification' },
    { key: 'attendance.liveness_detection_enabled', value: 'true', type: 'boolean', label: 'Liveness Detection' },
    { key: 'attendance.gps_required', value: 'true', type: 'boolean', label: 'GPS Wajib' },
    { key: 'attendance.geofence_required', value: 'true', type: 'boolean', label: 'Geofence Wajib' },
    { key: 'system.timezone', value: 'Asia/Jakarta', type: 'string', label: 'Timezone' },
    { key: 'system.work_start_time', value: '08:00', type: 'string', label: 'Jam Mulai Kerja' },
    { key: 'system.work_end_time', value: '17:00', type: 'string', label: 'Jam Selesai Kerja' },
    { key: 'security.face_similarity_threshold', value: '0.75', type: 'number', label: 'Face Similarity Threshold' },
    { key: 'security.max_gps_accuracy_meters', value: '50', type: 'number', label: 'Max GPS Accuracy (meter)' },
    { key: 'SUPERADMIN_2FA_REQUIRED', value: 'true', type: 'boolean', label: 'Require Superadmin 2FA' },
    { key: 'SELFIE_RETENTION_DAYS', value: '90', type: 'number', label: 'Selfie Retention Period (days)' },
    { key: 'OTP_EXPIRY_SECONDS', value: '300', type: 'number', label: 'OTP Expiry (seconds)' },
    { key: 'OTP_MAX_ATTEMPTS', value: '5', type: 'number', label: 'OTP Max Attempts' },
  ];
  for (const s of settings) {
    await prisma.systemSetting.upsert({
      where: { key: s.key },
      update: { value: s.value },
      create: s,
    });
  }

  // 19. INTEGRATION PROVIDERS
  console.log('  → Seeding integration providers...');
  const providers = [
    { id: 'provider-telegram', name: 'Telegram Bot', type: 'TELEGRAM', status: 'DISCONNECTED' },
    { id: 'provider-google-drive', name: 'Google Drive', type: 'GOOGLE_DRIVE', status: 'DISCONNECTED' },
    { id: 'provider-google-sheets', name: 'Google Sheets', type: 'GOOGLE_SHEETS', status: 'DISCONNECTED' },
  ];
  for (const p of providers) {
    await prisma.integrationProvider.upsert({
      where: { type: p.type },
      update: {},
      create: p,
    });
  }

  // 20. NOTIFICATION TEMPLATES
  console.log('  → Seeding notification templates...');
  const templates = [
    { event: 'CHECK_IN', template: '✅ *Check-In*\n\nKaryawan: {{employeeName}}\nWaktu: {{time}}\nLokasi: {{location}}\nStatus: {{status}}' },
    { event: 'CHECK_OUT', template: '🏁 *Check-Out*\n\nKaryawan: {{employeeName}}\nWaktu: {{time}}\nDurasi: {{duration}}\nStatus: {{status}}' },
    { event: 'LATE_CHECK_IN', template: '⚠️ *Terlambat Check-In*\n\nKaryawan: {{employeeName}}\nWaktu: {{time}}\nKeterlambatan: {{lateMinutes}} menit\nLokasi: {{location}}' },
    { event: 'OUTSIDE_GEOFENCE', template: '🚫 *Di Luar Area Geofence*\n\nKaryawan: {{employeeName}}\nWaktu: {{time}}\nJarak: {{distance}} meter dari kantor' },
    { event: 'FAILED_FACE_VERIFICATION', template: '❌ *Gagal Verifikasi Wajah*\n\nKaryawan: {{employeeName}}\nWaktu: {{time}}\nSkor: {{score}}' },
    { event: 'LEAVE_CREATED', template: '📋 *Pengajuan Cuti Baru*\n\nKaryawan: {{employeeName}}\nJenis: {{leaveType}}\nTanggal: {{startDate}} - {{endDate}}' },
    { event: 'LEAVE_APPROVED', template: '✅ *Cuti Disetujui*\n\nKaryawan: {{employeeName}}\nJenis: {{leaveType}}\nTanggal: {{startDate}} - {{endDate}}\nDisetujui oleh: {{approverName}}' },
    { event: 'LEAVE_REJECTED', template: '❌ *Cuti Ditolak*\n\nKaryawan: {{employeeName}}\nJenis: {{leaveType}}\nAlasan: {{reason}}' },
    { event: 'FAILED_LOGIN', template: '🔴 *Percobaan Login Gagal*\n\nEmail: {{email}}\nWaktu: {{time}}\nIP: {{ipAddress}}\nPercobaan ke: {{attempt}}' },
    { event: 'FAILED_2FA', template: '🔴 *2FA Gagal*\n\nUser: {{userName}}\nWaktu: {{time}}\nIP: {{ipAddress}}\nPercobaan ke: {{attempt}}' },
    { event: 'ROLE_CHANGED', template: '👤 *Role Berubah*\n\nKaryawan: {{employeeName}}\nRole Lama: {{oldRole}}\nRole Baru: {{newRole}}\nDiubah oleh: {{actorName}}' },
    { event: 'PERMISSION_CHANGED', template: '🔐 *Permission Berubah*\n\nKaryawan: {{employeeName}}\nPerubahan: {{changes}}\nDiubah oleh: {{actorName}}' },
    { event: 'NEW_DEVICE_LOGIN', template: '📱 *Login Dari Perangkat Baru*\n\nUser: {{userName}}\nWaktu: {{time}}\nIP: {{ipAddress}}\nPerangkat: {{device}}' },
  ];
  for (const t of templates) {
    await prisma.notificationTemplate.upsert({
      where: { event: t.event },
      update: {},
      create: t,
    });
  }

  // 17. AUDIT LOGS
  console.log('  → Seeding audit logs...');
  const auditLogs = [
    { id: 'aud-seed-001', actorId: IDS.usr.budi, actorName: 'Budi Santoso', actorRole: 'employee', action: 'CHECK_IN', module: 'ATTENDANCE', result: 'SUCCESS', details: 'Check-in tepat waktu. Face: 99.1%, Liveness: PASS, Geofence: 32m', createdAt: new Date('2026-10-02T08:01:32+07:00') },
    { id: 'aud-seed-002', actorId: IDS.usr.budi, actorName: 'Budi Santoso', actorRole: 'employee', action: 'REQUEST_CREATED', module: 'APPROVAL', result: 'SUCCESS', details: 'Pengajuan Cuti Tahunan 2 hari (08-09 Okt 2026)', createdAt: new Date('2026-10-02T08:20:05+07:00') },
    { id: 'aud-seed-003', actorId: IDS.usr.dewi, actorName: 'Dewi Anggraini', actorRole: 'employee', action: 'CHECK_IN', module: 'ATTENDANCE', result: 'SUCCESS', details: 'Terlambat 24m, Geofence: Cabang Jakarta (22m)', createdAt: new Date('2026-10-02T08:24:12+07:00') },
    { id: 'aud-seed-004', actorId: IDS.usr.siti, actorName: 'Siti Rahma', actorRole: 'hr', action: 'CHECK_IN', module: 'ATTENDANCE', result: 'SUCCESS', details: 'Tepat waktu. Face: 98.9%, Liveness: PASS', createdAt: new Date('2026-10-02T07:48:19+07:00') },
    { id: 'aud-seed-005', actorId: null, actorName: 'System Cron', actorRole: 'system', action: 'SYSTEM_EVENT', module: 'SYSTEM', result: 'SUCCESS', details: 'Auto-sync attendance report berhasil (124 baris)', createdAt: new Date('2026-10-01T18:40:00+07:00') },
    { id: 'aud-seed-006', actorId: IDS.usr.hendra, actorName: 'Hendra Gunawan', actorRole: 'employee', action: 'CHECK_IN', module: 'ATTENDANCE', result: 'FAILED', details: 'Lokasi di luar radius geofence (1.4 km dari titik kantor)', createdAt: new Date('2026-10-02T06:45:10+07:00') },
    { id: 'aud-seed-007', actorId: IDS.usr.siti, actorName: 'Siti Rahma', actorRole: 'hr', action: 'REQUEST_APPROVED', module: 'APPROVAL', result: 'SUCCESS', details: 'Pengajuan izin setengah hari Tri Mulyadi disetujui', createdAt: new Date('2026-09-29T14:00:00+07:00') },
    { id: 'aud-seed-008', actorId: IDS.usr.andi, actorName: 'Andi Wijaya', actorRole: 'superadmin', action: 'EMPLOYEE_CREATED', module: 'EMPLOYEES', result: 'SUCCESS', details: 'Karyawan baru: Yoga Pranata (EMP-00134) didaftarkan', createdAt: new Date('2026-05-01T09:00:00+07:00') },
    { id: 'aud-seed-009', actorId: IDS.usr.bambang, actorName: 'Bambang Soediro', actorRole: 'admin', action: 'DEVICE_BIND', module: 'SECURITY', result: 'SUCCESS', details: 'Device Nadia Permata baru (iPhone 14) diaktifkan', createdAt: new Date('2026-08-15T10:00:00+07:00') },
    { id: 'aud-seed-010', actorId: null, actorName: 'System', actorRole: 'system', action: 'LOGIN_FAILED', module: 'AUTH', result: 'FAILED', details: '3 kali berturut-turut kesalahan password dari IP mencurigakan 103.28.12.89', createdAt: new Date('2026-10-01T21:14:00+07:00') },
  ];
  for (const al of auditLogs) {
    await prisma.auditLog.upsert({
      where: { id: al.id },
      update: {},
      create: al,
    });
  }

  // 18. NOTIFICATIONS
  console.log('  → Seeding notifications...');
  const notifications = [
    { id: 'notif-seed-001', userId: IDS.usr.budi, title: 'Check-In Berhasil', message: 'Absensi masuk Anda telah tercatat pukul 08:01 WIB di Kantor Pusat Bandung.', category: 'ATTENDANCE', isRead: false, createdAt: new Date('2026-10-02T08:01:00+07:00') },
    { id: 'notif-seed-002', userId: IDS.usr.budi, title: 'Pengajuan Cuti Terkirim', message: 'Pengajuan cuti 2 hari (08-09 Okt 2026) sedang menunggu review atasan.', category: 'APPROVAL', isRead: false, createdAt: new Date('2026-10-02T08:20:00+07:00') },
    { id: 'notif-seed-003', userId: IDS.usr.siti, title: '3 Approval Membutuhkan Tindakan', message: 'Terdapat 3 pengajuan yang belum ditindaklanjuti.', category: 'APPROVAL', isRead: false, createdAt: new Date('2026-10-02T09:00:00+07:00') },
    { id: 'notif-seed-004', userId: IDS.usr.ahmad, title: 'Pengajuan Baru dari Tim', message: 'Budi Santoso mengajukan cuti 2 hari. Segera tinjau.', category: 'APPROVAL', isRead: false, createdAt: new Date('2026-10-02T08:21:00+07:00') },
    { id: 'notif-seed-005', userId: IDS.usr.tri, title: 'Izin Setengah Hari Disetujui', message: 'Izin setengah hari Anda pada 05 Okt 2026 telah disetujui oleh Siti Rahma.', category: 'APPROVAL', isRead: true, createdAt: new Date('2026-09-29T14:00:00+07:00') },
    { id: 'notif-seed-006', userId: IDS.usr.budi, title: 'Cuti September Disetujui', message: 'Pengajuan cuti 15-16 Sep 2026 telah disetujui.', category: 'APPROVAL', isRead: true, createdAt: new Date('2026-09-10T13:45:00+07:00') },
    { id: 'notif-seed-007', userId: IDS.usr.andi, title: 'Peringatan Keamanan', message: 'Percobaan login gagal 3x dari IP 103.28.12.89 terdeteksi.', category: 'SECURITY', isRead: false, createdAt: new Date('2026-10-01T21:15:00+07:00') },
    { id: 'notif-seed-008', userId: IDS.usr.fajar, title: 'Pengajuan Cuti Ditolak', message: 'Pengajuan cuti 22-25 Sep 2026 Anda ditolak: Periode sibuk sprint delivery.', category: 'APPROVAL', isRead: true, createdAt: new Date('2026-09-15T15:00:00+07:00') },
  ];
  for (const n of notifications) {
    await prisma.notification.upsert({
      where: { id: n.id },
      update: {},
      create: n,
    });
  }

  console.log('✅ Seed completed successfully!');
  console.log('');
  console.log('📊 Seed Summary:');
  console.log('  Departments: 5');
  console.log('  Positions: 10');
  console.log('  Roles: 6');
  console.log('  Permissions: 29 (incl. system.integration.manage)');
  console.log('  Users: 15');
  console.log('  Employees: 15');
  console.log('  Shifts: 4');
  console.log('  Schedules: 3');
  console.log('  Office Locations: 2');
  console.log('  Holidays: 7');
  console.log('  Leave Types: 5');
  console.log('  Leave Balances: 15');
  console.log('  Devices: 9');
  console.log('  Face Profiles: 13');
  console.log('  Attendance Records: ~200 (30 days × 8 employees)');
  console.log('  Requests: 8');
  console.log('  Approval History: 13 entries');
  console.log('  System Settings: 16 (incl. 2FA & integration settings)');
  console.log('  Integration Providers: 3 (Telegram, Google Drive, Google Sheets)');
  console.log('  Notification Templates: 13');
  console.log('  Audit Logs: 10');
  console.log('  Notifications: 8');
  console.log('');
  console.log('🔑 Login Credentials (Development Only):');
  console.log('  Employee:   budi.santoso@company.id   / Employee123!');
  console.log('  Supervisor: ahmad.fauzi@company.id    / Supervisor123!');
  console.log('  Manager:    tri.mulyadi@company.id    / Manager123!');
  console.log('  HR:         siti.rahma@company.id     / HR123!');
  console.log('  Admin:      bambang.s@company.id      / Admin123!');
  console.log('  Superadmin: andi.wijaya@company.id    / Superadmin123!');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
