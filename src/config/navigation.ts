import { UserRole } from '../types';
import {
  LayoutDashboard,
  MapPin,
  FileText,
  History,
  User,
  CheckSquare,
  Users,
  BarChart3,
  Calendar,
  Sliders,
  ShieldCheck,
  ShieldAlert,
  Smartphone,
  KeyRound,
  FileSpreadsheet,
  HardDrive,
  Send,
  DollarSign,
  LucideIcon,
} from 'lucide-react';

export type Permission =
  | 'attendance.view'
  | 'attendance.create'
  | 'request.view'
  | 'request.create'
  | 'request.approve'
  | 'team.view'
  | 'employee.view'
  | 'employee.manage'
  | 'report.view'
  | 'report.export'
  | 'calendar.manage'
  | 'geofence.manage'
  | 'device.manage'
  | 'audit.view'
  | 'security.view'
  | 'roles.manage'
  | 'integrations.manage'
  | 'system.manage'
  | 'payroll.view';

export const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  Employee: [
    'attendance.view',
    'attendance.create',
    'request.view',
    'request.create',
  ],
  Supervisor: [
    'attendance.view',
    'attendance.create',
    'request.view',
    'request.create',
    'request.approve',
    'team.view',
    'report.view',
  ],
  Manager: [
    'attendance.view',
    'attendance.create',
    'request.view',
    'request.create',
    'request.approve',
    'team.view',
    'report.view',
    'report.export',
  ],
  HR: [
    'attendance.view',
    'attendance.create',
    'request.view',
    'request.create',
    'request.approve',
    'employee.view',
    'employee.manage',
    'report.view',
    'report.export',
    'calendar.manage',
    'system.manage',
  ],
  Admin: [
    'attendance.view',
    'attendance.create',
    'request.view',
    'request.create',
    'request.approve',
    'employee.view',
    'employee.manage',
    'report.view',
    'report.export',
    'calendar.manage',
    'geofence.manage',
    'device.manage',
    'audit.view',
    'security.view',
    'system.manage',
  ],
  Superadmin: [
    'attendance.view',
    'attendance.create',
    'request.view',
    'request.create',
    'request.approve',
    'team.view',
    'employee.view',
    'employee.manage',
    'report.view',
    'report.export',
    'calendar.manage',
    'geofence.manage',
    'device.manage',
    'audit.view',
    'security.view',
    'roles.manage',
    'integrations.manage',
    'system.manage',
    'payroll.view',
  ],
};

export interface NavItemConfig {
  id: string;
  label: string;
  icon: LucideIcon;
  section?: string;
  requiredPermissions?: Permission[];
  badgeKey?: string;
  description?: string;
}

export const CENTRAL_NAVIGATION: NavItemConfig[] = [
  // Core
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: LayoutDashboard,
    section: 'MAIN',
    description: 'Ringkasan presensi harian & aktivitas',
  },

  // Operasional
  {
    id: 'kehadiran',
    label: 'Kehadiran',
    icon: MapPin,
    section: 'OPERASIONAL',
    requiredPermissions: ['attendance.view'],
    description: 'Check-in, check-out, status GPS & biometrik',
  },
  {
    id: 'persetujuan',
    label: 'Persetujuan',
    icon: CheckSquare,
    section: 'OPERASIONAL',
    requiredPermissions: ['request.approve'],
    badgeKey: 'pendingApprovals',
    description: 'Antrean review cuti, izin, sakit, dan dinas',
  },
  {
    id: 'tim-saya',
    label: 'Tim Saya',
    icon: Users,
    section: 'OPERASIONAL',
    requiredPermissions: ['team.view'],
    description: 'Monitoring kehadiran anggota regu kerja',
  },
  {
    id: 'pengajuan',
    label: 'Pengajuan',
    icon: FileText,
    section: 'OPERASIONAL',
    requiredPermissions: ['request.view'],
    description: 'Permohonan izin, cuti, sakit, dan tugas luar',
  },
  {
    id: 'riwayat',
    label: 'Riwayat',
    icon: History,
    section: 'OPERASIONAL',
    requiredPermissions: ['attendance.view'],
    description: 'Log catatan kehadiran dan logbook kerja',
  },
  {
    id: 'laporan',
    label: 'Laporan',
    icon: BarChart3,
    section: 'OPERASIONAL',
    requiredPermissions: ['report.view'],
    description: 'Rekapitulasi kehadiran, keterlambatan & ekspor',
  },

  // People
  {
    id: 'karyawan',
    label: 'Karyawan',
    icon: Users,
    section: 'PEOPLE',
    requiredPermissions: ['employee.view'],
    description: 'Direktori staf, posisi, dan manajemen akun',
  },
  {
    id: 'geofence',
    label: 'Lokasi Kantor',
    icon: MapPin,
    section: 'PEOPLE',
    requiredPermissions: ['geofence.manage'],
    description: 'Radius GPS kantor pusat & cabang',
  },

  // Workforce
  {
    id: 'kalender',
    label: 'Kalender & Libur',
    icon: Calendar,
    section: 'WORKFORCE',
    requiredPermissions: ['calendar.manage'],
    description: 'Hari libur nasional & cuti bersama',
  },

  // Security
  {
    id: 'perangkat',
    label: 'Perangkat',
    icon: Smartphone,
    section: 'SECURITY',
    requiredPermissions: ['device.manage'],
    description: 'Binding hardware & single device lock',
  },
  {
    id: 'audit-security',
    label: 'Audit & Security',
    icon: ShieldCheck,
    section: 'SECURITY',
    requiredPermissions: ['audit.view'],
    description: 'Log forensik ISO 27001 & deteksi fraud',
  },
  {
    id: 'keamanan-2fa',
    label: '2FA Superadmin',
    icon: KeyRound,
    section: 'SECURITY',
    requiredPermissions: ['roles.manage'],
    description: 'Proteksi OTP Telegram level eksekutif',
  },

  // Integrations
  {
    id: 'integrasi-sheets',
    label: 'Google Sheets',
    icon: FileSpreadsheet,
    section: 'INTEGRATIONS',
    requiredPermissions: ['integrations.manage'],
    description: 'Sinkronisasi cloud spreadsheet',
  },
  {
    id: 'integrasi-drive',
    label: 'Google Drive',
    icon: HardDrive,
    section: 'INTEGRATIONS',
    requiredPermissions: ['integrations.manage'],
    description: 'Penyimpanan arsip foto biometrik',
  },
  {
    id: 'integrasi-telegram',
    label: 'Telegram Bot',
    icon: Send,
    section: 'INTEGRATIONS',
    requiredPermissions: ['integrations.manage'],
    description: 'Bot notifikasi otomatis presensi',
  },

  // System
  {
    id: 'roles-permissions',
    label: 'Access Control (RBAC)',
    icon: KeyRound,
    section: 'SYSTEM',
    requiredPermissions: ['roles.manage'],
    description: 'Matriks izin role sistem',
  },
  {
    id: 'payroll',
    label: 'Payroll Preparation',
    icon: DollarSign,
    section: 'SYSTEM',
    requiredPermissions: ['payroll.view'],
    description: 'Rekapitulasi cut-off penggajian',
  },
  {
    id: 'pengaturan',
    label: 'Pengaturan',
    icon: Sliders,
    section: 'SYSTEM',
    requiredPermissions: ['system.manage'],
    description: 'Konfigurasi parameter kehadiran & sistem',
  },

  // User Profile
  {
    id: 'profil',
    label: 'Profil',
    icon: User,
    section: 'USER',
    description: 'Biodata, foto wajah biometrik & perangkat',
  },
];

export interface NavSectionDef {
  id: string;
  title: string;
}

export const NAV_SECTIONS: NavSectionDef[] = [
  { id: 'MAIN', title: 'OVERVIEW' },
  { id: 'OPERASIONAL', title: 'OPERASIONAL' },
  { id: 'PEOPLE', title: 'PEOPLE & WORKFORCE' },
  { id: 'SECURITY', title: 'SECURITY' },
  { id: 'INTEGRATIONS', title: 'INTEGRATIONS' },
  { id: 'SYSTEM', title: 'SYSTEM & PAYROLL' },
  { id: 'USER', title: 'AKUN & PROFIL' },
];

export interface NavSection {
  section: string;
  sectionId: string;
  items: (NavItemConfig & { badge?: number })[];
}

export function hasPermission(
  role: UserRole,
  required?: Permission[],
  customPermissions?: Permission[]
): boolean {
  if (!required || required.length === 0) return true;
  const userPerms = customPermissions || ROLE_PERMISSIONS[role] || [];
  return required.every((p) => userPerms.includes(p));
}

export function getFilteredNav(
  role: UserRole,
  badges: Record<string, number> = {},
  customPermissions?: Permission[]
): NavSection[] {
  // 1. Filter items strictly based on role permissions
  const allowedItems = CENTRAL_NAVIGATION.filter((item) =>
    hasPermission(role, item.requiredPermissions, customPermissions)
  ).map((item) => ({
    ...item,
    badge: item.badgeKey ? badges[item.badgeKey] : undefined,
  }));

  // 2. Special simplified presentation for Employee:
  // Employee role is dedicated to day-to-day attendance and self-service.
  // Group into a single clean 'MENU UTAMA' section to avoid unnecessary visual clutter.
  if (role === 'Employee') {
    return [
      {
        section: 'MENU UTAMA',
        sectionId: 'MAIN',
        items: allowedItems,
      },
    ];
  }

  // 3. For all other roles (Supervisor, Manager, HR, Admin, Superadmin),
  // dynamically group according to NAV_SECTIONS, automatically omitting empty sections.
  const sections: NavSection[] = [];

  for (const secDef of NAV_SECTIONS) {
    const matchingItems = allowedItems.filter((item) => {
      if (secDef.id === 'PEOPLE') {
        return item.section === 'PEOPLE' || item.section === 'WORKFORCE';
      }
      return item.section === secDef.id;
    });

    if (matchingItems.length > 0) {
      sections.push({
        section: secDef.title,
        sectionId: secDef.id,
        items: matchingItems,
      });
    }
  }

  return sections;
}
