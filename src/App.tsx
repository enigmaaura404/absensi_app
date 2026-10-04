import React, { useState, useEffect, useCallback } from 'react';
import {
  User,
  UserRole,
  AttendanceRecord,
  RequestItem,
  GeofenceLocation,
  DeviceItem,
  HolidayItem,
  AuditLogItem,
  SecurityEventItem,
  NotificationItem,
} from './types';
import { ShieldAlert } from 'lucide-react';
import { getTodayDateString, formatTimeWIB } from './utils/time';
import { hasPermission, CENTRAL_NAVIGATION } from './config/navigation';
import { authService } from './services/auth/auth.service';
import { AuthUser } from './services/auth/auth.types';
import { apiClient } from './services/api/api.client';

// Layout & Common Components
import { Sidebar } from './components/layout/Sidebar';
import { Topbar } from './components/layout/Topbar';
import { MobileNav } from './components/layout/MobileNav';
import { ToastContainer, ToastMessage } from './components/common/Toast';
import { CommandMenu } from './components/common/CommandMenu';

// Public Landing Page
import { LandingPage } from './pages/landing/LandingPage';

// Pages
import { LoginPage } from './pages/auth/LoginPage';
import { EmployeeDashboard } from './pages/employee/EmployeeDashboard';
import { KehadiranPage } from './pages/employee/KehadiranPage';
import { CheckInPage } from './pages/employee/CheckInPage';
import { CheckOutPage } from './pages/employee/CheckOutPage';
import { DinasPage } from './pages/employee/DinasPage';
import { PengajuanPage } from './pages/employee/PengajuanPage';
import { CutiPage } from './pages/employee/CutiPage';
import { RiwayatKehadiranPage } from './pages/employee/RiwayatKehadiranPage';
import { ProfilePage } from './pages/employee/ProfilePage';
import { FaceVerificationPage } from './pages/employee/FaceVerificationPage';
import { DevicePage } from './pages/employee/DevicePage';
import { TimSayaPage } from './pages/supervisor/TimSayaPage';

import { AdminDashboard } from './pages/admin/AdminDashboard';
import { ApprovalPage } from './pages/admin/ApprovalPage';
import { EmployeeManagementPage } from './pages/admin/EmployeeManagementPage';
import { GeofencePage } from './pages/admin/GeofencePage';
import { DevicesAdminPage } from './pages/admin/DevicesAdminPage';
import { AuditTrailPage } from './pages/admin/AuditTrailPage';
import { SecurityEventsPage } from './pages/admin/SecurityEventsPage';
import { RolesPermissionsPage } from './pages/admin/RolesPermissionsPage';
import { GoogleSheetsPage } from './pages/admin/GoogleSheetsPage';
import { GoogleDrivePage } from './pages/admin/GoogleDrivePage';
import { TelegramBotPage } from './pages/admin/TelegramBotPage';
import { Security2FAPage } from './pages/admin/Security2FAPage';
import { CalendarHolidaysPage } from './pages/admin/CalendarHolidaysPage';
import { LaporanPage } from './pages/admin/LaporanPage';
import { PayrollPage } from './pages/admin/PayrollPage';
import { SystemSettingsPage, SystemSettings } from './pages/admin/SystemSettingsPage';

// ─────────────────────────────────────────────────────────────────────────────
// Type Mappers — API Response → Internal App Types
// ─────────────────────────────────────────────────────────────────────────────

function mapApiEmployeeToUser(e: any): User {
  const primaryRole = (e.roles?.[0]
    ? e.roles[0].charAt(0).toUpperCase() + e.roles[0].slice(1)
    : 'Employee') as UserRole;

  return {
    id: e.id,
    employeeId: e.employeeCode || e.id,
    name: e.fullName,
    email: e.email,
    phone: e.phone || '',
    role: primaryRole,
    department: e.departmentName || 'General',
    position: e.positionName || 'Staff',
    joinDate: e.joinDate || '',
    avatar:
      e.avatarUrl ||
      'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&auto=format&fit=crop&q=80',
    status: e.status === 'ACTIVE' ? 'Active' : 'Inactive',
    faceVerified: false,
    deviceVerified: false,
    leaveBalance: {
      total: e.leaveBalance?.total ?? 12,
      used: e.leaveBalance?.used ?? 0,
      pending: e.leaveBalance?.pending ?? 0,
      remaining: e.leaveBalance?.remaining ?? 12,
    },
  } as any;
}

function mapApiAttendanceToRecord(a: any): AttendanceRecord {
  return {
    id: a.id,
    employeeId: a.employeeId,
    employeeName: a.employeeName || 'Karyawan',
    department: a.departmentName || 'Umum',
    date: a.date || a.workDate,
    checkInTime: a.checkIn
      ? new Date(a.checkIn).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
      : null,
    checkOutTime: a.checkOut
      ? new Date(a.checkOut).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
      : null,
    status: (
      a.status === 'PRESENT' || a.status === 'present'
        ? 'Hadir'
        : a.status === 'LATE' || a.status === 'late'
        ? 'Terlambat'
        : a.status === 'ABSENT' || a.status === 'absent'
        ? 'Tidak Hadir'
        : 'Hadir'
    ) as any,
    duration: a.workMinutes
      ? `${Math.floor(a.workMinutes / 60)}j ${a.workMinutes % 60}m`
      : a.checkIn && !a.checkOut
      ? 'Berjalan'
      : '0m',
    durationMinutes: a.workMinutes || null,
    shiftId: a.shiftId || 'shift-regular',
    lateMinutes: a.lateMinutes || 0,
    location: a.checkInAddress || 'Kantor Pusat',
    coordinates:
      a.checkInLatitude && a.checkInLongitude
        ? `${a.checkInLatitude}, ${a.checkInLongitude}`
        : '-6.917464, 107.619123',
    device: 'System Registered Device',
    ip: '182.253.14.88',
    selfieUrl: a.selfieUrl || '',
    notes: a.notes,
  };
}

function mapApiRequestToItem(r: any): RequestItem {
  const typeMap: Record<string, string> = {
    LEAVE: 'Cuti Tahunan',
    leave: 'Cuti Tahunan',
    SICK: 'Izin Sakit',
    sick: 'Izin Sakit',
    PERMIT: 'Izin Keperluan Pribadi',
    permit: 'Izin Keperluan Pribadi',
    DINAS: 'Dinas Luar',
    dinas: 'Dinas Luar',
    CORRECTION: 'Koreksi',
    correction: 'Koreksi',
  };

  const statusMap: Record<string, string> = {
    PENDING: 'Pending',
    APPROVED: 'Approved',
    REJECTED: 'Rejected',
    CANCELLED: 'Cancelled',
  };

  return {
    id: r.id,
    employeeId: r.employeeId,
    employeeName: r.employeeName || 'Karyawan',
    department: r.departmentName || 'Umum',
    type: (typeMap[r.type] || typeMap[r.requestType] || 'Izin') as any,
    startDate: r.startDate,
    endDate: r.endDate,
    days: r.days || 1,
    reason: r.reason || '',
    status: (statusMap[r.status] || 'Pending') as any,
    submittedAt: r.createdAt ? r.createdAt.split('T')[0] : (r.startDate || ''),
    approverName: r.approvalHistory?.[0]?.approverName || 'Supervisor',
    notes: r.approvalNotes,
  };
}

function mapApiLocationToGeofence(l: any): GeofenceLocation {
  return {
    id: l.id,
    name: l.name,
    address: l.address || '',
    latitude: l.latitude,
    longitude: l.longitude,
    radiusMeters: l.radiusMeters || 100,
    active: l.isActive !== false,
  } as any;
}

function mapApiHolidayToItem(h: any): HolidayItem {
  return {
    id: h.id,
    name: h.name,
    date: h.date,
    type: h.type === 'NATIONAL' ? 'Nasional' : h.type === 'COMPANY' ? 'Perusahaan' : 'Cuti Bersama',
    description: h.description || '',
  };
}

function mapApiDeviceToItem(d: any): DeviceItem {
  return {
    id: d.id,
    employeeId: d.employeeId,
    employeeName: d.employeeName || 'Karyawan',
    deviceModel: d.deviceModel || 'Unknown Device',
    platform: d.platform || 'Unknown OS',
    browser: d.browser || 'Unknown Browser',
    status: (d.status === 'ACTIVE' ? 'Active' : d.status === 'BLOCKED' ? 'Disabled' : 'Active') as any,
    registeredAt: d.registeredAt ? d.registeredAt.split('T')[0] : getTodayDateString(),
    lastSeenAt: d.lastSeenAt || undefined,
  } as any;
}

function mapApiAuditToItem(a: any): AuditLogItem {
  return {
    id: a.id,
    timestamp: a.createdAt ? a.createdAt.replace('T', ' ').substring(0, 19) : getTodayDateString(),
    user: a.actorName ? `${a.actorName} (${a.actorRole || 'Staff'})` : 'System',
    action: a.action,
    module: a.module,
    ip: a.ipAddress || '127.0.0.1',
    device: 'System Device',
    result: a.result === 'FAILED' ? 'FAILED' : 'SUCCESS',
    details: a.details || '',
  };
}

/**
 * Maps an AuthUser (from auth service) to the app's internal User shape.
 */
function authUserToAppUser(authUser: AuthUser): User {
  return {
    id: authUser.id,
    employeeId: authUser.employeeId,
    name: authUser.name,
    email: authUser.email,
    role: authUser.role as UserRole,
    department: authUser.department,
    position: authUser.position,
    avatar:
      authUser.avatar ||
      'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&auto=format&fit=crop&q=80',
    phone: authUser.phone ?? '',
    joinDate: '',
    status: 'Active',
    faceVerified: false,
    deviceVerified: false,
    leaveBalance: { total: 12, used: 0, pending: 0, remaining: 12 },
  } as any;
}

// ─────────────────────────────────────────────────────────────────────────────
// Default system settings
// ─────────────────────────────────────────────────────────────────────────────
const DEFAULT_SYSTEM_SETTINGS: SystemSettings = {
  gracePeriod: 10,
  requiredSelfie: true,
  faceVerification: true,
  livenessDetection: true,
  gpsRequired: true,
  geofenceRequired: true,
  companyName: 'PT Teknologi Absensi Mandiri',
  timezone: 'Asia/Jakarta (WIB)',
  workStartTime: '08:00',
  workEndTime: '17:00',
};

// ─────────────────────────────────────────────────────────────────────────────
// PLACEHOLDER_USER — used only before auth resolves. Blank, never shown in UI.
// ─────────────────────────────────────────────────────────────────────────────
const PLACEHOLDER_USER: User = {
  id: '',
  employeeId: '',
  name: '',
  email: '',
  role: 'Employee',
  department: '',
  position: '',
  joinDate: '',
  avatar: '',
  phone: '',
  status: 'Active',
  faceVerified: false,
  deviceVerified: false,
  leaveBalance: { total: 0, used: 0, pending: 0, remaining: 0 },
} as any;

// ─────────────────────────────────────────────────────────────────────────────
// App Component
// ─────────────────────────────────────────────────────────────────────────────
export default function App() {
  // ── Session bootstrap: recover auth from localStorage on startup ──
  const recoveredSession = authService.getCurrentUser();
  const initialUser: User = recoveredSession
    ? authUserToAppUser(recoveredSession)
    : PLACEHOLDER_USER;
  const initialLoggedIn = recoveredSession !== null;
  const initialViewMode: 'landing' | 'login' | 'app' = recoveredSession ? 'app' : 'landing';

  // Authentication State
  const [isLoggedIn, setIsLoggedIn] = useState(initialLoggedIn);
  const [viewMode, setViewMode] = useState<'landing' | 'login' | 'app'>(initialViewMode);
  const [currentUser, setCurrentUser] = useState<User>(initialUser);

  // Navigation State
  const [currentRoute, setCurrentRoute] = useState<string>('dashboard');
  const [isSidebarOpenMobile, setIsSidebarOpenMobile] = useState(false);
  const [isCommandMenuOpen, setIsCommandMenuOpen] = useState(false);

  // Global Keyboard Shortcut (⌘K / Ctrl+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsCommandMenuOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // ── Real Data States — initialized empty; populated from API ──
  const [employees, setEmployees] = useState<User[]>([]);
  const [todayAttendance, setTodayAttendance] = useState<AttendanceRecord[]>([]);
  const [historyAttendance, setHistoryAttendance] = useState<AttendanceRecord[]>([]);
  const [requests, setRequests] = useState<RequestItem[]>([]);
  const [geofences, setGeofences] = useState<GeofenceLocation[]>([]);
  const [devices, setDevices] = useState<DeviceItem[]>([]);
  const [holidays, setHolidays] = useState<HolidayItem[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLogItem[]>([]);
  const [securityEvents, setSecurityEvents] = useState<SecurityEventItem[]>([]);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [systemSettings, setSystemSettings] = useState<SystemSettings>(DEFAULT_SYSTEM_SETTINGS);

  // ── Load real data from NestJS API ──
  const loadDataFromApi = useCallback(async () => {
    if (!isLoggedIn) return;

    try {
      const [
        empRes,
        attHistRes,
        todayAttRes,
        reqRes,
        locRes,
        holRes,
        devRes,
        audRes,
        setRes,
        notifRes,
      ] = await Promise.all([
        apiClient.getEmployees({ pageSize: 100 }).catch(() => null),
        apiClient.getAttendanceHistory({ pageSize: 100 }).catch(() => null),
        apiClient.getTodayAttendance().catch(() => null),
        apiClient.getRequests({ pageSize: 100 }).catch(() => null),
        apiClient.getLocations().catch(() => null),
        apiClient.getHolidays().catch(() => null),
        apiClient.getDevices().catch(() => null),
        apiClient.getAuditLogs({ pageSize: 100 }).catch(() => null),
        apiClient.getSettings().catch(() => null),
        apiClient.getNotifications({ pageSize: 50 }).catch(() => null),
      ]);

      if (empRes?.items?.length) {
        setEmployees(empRes.items.map(mapApiEmployeeToUser));
      }

      if (attHistRes?.items?.length) {
        setHistoryAttendance(attHistRes.items.map(mapApiAttendanceToRecord));
      }

      if (todayAttRes) {
        setTodayAttendance([mapApiAttendanceToRecord(todayAttRes)]);
      }

      if (reqRes?.items?.length) {
        setRequests(reqRes.items.map(mapApiRequestToItem));
      }

      if (locRes && Array.isArray(locRes) && locRes.length > 0) {
        setGeofences(locRes.map(mapApiLocationToGeofence));
      }

      if (holRes && Array.isArray(holRes) && holRes.length > 0) {
        setHolidays(holRes.map(mapApiHolidayToItem));
      }

      if (devRes && Array.isArray(devRes) && devRes.length > 0) {
        setDevices(devRes.map(mapApiDeviceToItem));
      }

      if (audRes?.items?.length) {
        setAuditLogs(audRes.items.map(mapApiAuditToItem));
      }

      if (setRes && Array.isArray(setRes) && setRes.length > 0) {
        const settingsMap: Partial<SystemSettings> = {};
        for (const s of setRes) {
          if (s.key === 'grace_period_minutes') settingsMap.gracePeriod = Number(s.value);
          if (s.key === 'require_selfie') settingsMap.requiredSelfie = s.value === 'true';
          if (s.key === 'require_liveness') settingsMap.livenessDetection = s.value === 'true';
          if (s.key === 'require_geofence') settingsMap.geofenceRequired = s.value === 'true';
          if (s.key === 'company_name') settingsMap.companyName = s.value;
          if (s.key === 'work_start_time') settingsMap.workStartTime = s.value;
          if (s.key === 'work_end_time') settingsMap.workEndTime = s.value;
        }
        setSystemSettings((prev) => ({ ...prev, ...settingsMap }));
      }

      if (notifRes?.items) {
        setNotifications(notifRes.items.map((n: any) => ({
          id: n.id,
          title: n.title,
          message: n.message,
          category: n.category,
          timestamp: n.createdAt ? new Date(n.createdAt).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) : '',
          unread: !n.isRead,
        })));
      }
    } catch (err) {
      console.warn('[App] API background load skipped:', err);
    }
  }, [isLoggedIn]);

  useEffect(() => {
    loadDataFromApi();
  }, [loadDataFromApi]);


  // Toast System
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = (type: ToastMessage['type'], title: string, message?: string) => {
    const id = `toast-${Date.now()}-${Math.random()}`;
    setToasts((prev) => [...prev, { id, type, title, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  /**
   * Login handler — receives a fully-resolved AuthUser from authService.
   */
  const handleLogin = (authUser: AuthUser) => {
    const appUser = authUserToAppUser(authUser);
    setIsLoggedIn(true);
    setCurrentUser(appUser);
    setCurrentRoute('dashboard');
    setViewMode('app');
    addToast('success', `Selamat datang, ${authUser.name}`, `Masuk sebagai ${authUser.role}`);
  };

  /** Logout handler — clears session via authService then returns to landing. */
  const handleLogout = () => {
    authService.logout();
    setIsLoggedIn(false);
    setCurrentRoute('dashboard');
    setViewMode('landing');
    // Clear all app data on logout
    setEmployees([]);
    setTodayAttendance([]);
    setHistoryAttendance([]);
    setRequests([]);
    addToast('info', 'Anda telah keluar', 'Sesi login telah diakhiri.');
  };

  // ── Check-In Success handler — API-first ──
  const handleSuccessCheckIn = async (time: string, location: string, coords?: string) => {
    try {
      const [lat, lng] = coords
        ? coords.split(',').map((s) => parseFloat(s.trim()))
        : [-6.917464, 107.619123];

      // PRIMARY: Call API first, wait for real DB write
      const result = await apiClient.checkIn({
        coordinates: { latitude: lat, longitude: lng },
        notes: `Check-in di ${location}`,
      });

      // SECONDARY: Refresh all data from DB to keep UI in sync
      await loadDataFromApi();

      const status = result?.status === 'late' ? 'Terlambat' : 'Hadir';
      const lateMins = result?.lateMinutes || 0;
      const cleanTime = time.replace(' WIB', '');

      const toastTitle = status === 'Terlambat' ? 'Check-In Tercatat (Terlambat)' : 'Check-In Berhasil';
      const toastMsg = status === 'Terlambat'
        ? `Absensi masuk tercatat pukul ${cleanTime} (Terlambat ${lateMins} menit).`
        : `Absensi masuk tercatat tepat waktu pukul ${cleanTime}`;
      addToast(status === 'Terlambat' ? 'warning' : 'success', toastTitle, toastMsg);
    } catch (err: any) {
      addToast('error', 'Check-In Gagal', err?.message || 'Terjadi kesalahan saat melakukan check-in.');
    }
  };

  // ── Bulk Delete Attendance Records (Admin / Superadmin / HR only) — API-first ──
  const handleBulkDeleteAttendance = async (ids: string[]) => {
    if (currentUser.role !== 'Admin' && currentUser.role !== 'Superadmin' && currentUser.role !== 'HR') {
      addToast('error', 'Akses Ditolak', 'Karyawan tidak memiliki izin untuk menghapus catatan presensi.');
      return;
    }

    try {
      await apiClient.bulkDeleteAttendance(ids);
      await loadDataFromApi();
      addToast('success', 'Hapus Massal Berhasil', `${ids.length} data absensi telah dihapus dari database.`);
    } catch (err: any) {
      addToast('error', 'Hapus Gagal', err?.message || 'Terjadi kesalahan saat menghapus data.');
    }
  };

  // ── Check-Out Success handler — API-first ──
  const handleSuccessCheckOut = async (time: string) => {
    try {
      const result = await apiClient.checkOut({
        coordinates: { latitude: -6.917464, longitude: 107.619123 },
        notes: `Check-out pukul ${time.replace(' WIB', '')}`,
      });

      await loadDataFromApi();

      const duration = result?.workMinutes
        ? `${Math.floor(result.workMinutes / 60)}j ${result.workMinutes % 60}m`
        : '';
      addToast('success', 'Check-Out Berhasil', `Absensi pulang tercatat pukul ${time.replace(' WIB', '')}${duration ? `. Durasi kerja: ${duration}` : ''}`);
    } catch (err: any) {
      addToast('error', 'Check-Out Gagal', err?.message || 'Terjadi kesalahan saat melakukan check-out.');
    }
  };

  // ── Leave / Request handler — API-first ──
  const handleAddRequest = async (item: RequestItem) => {
    try {
      const typeStr = item.type as string;
      await apiClient.createRequest({
        requestType: (
          typeStr === 'Cuti Tahunan' || typeStr === 'Cuti' ? 'LEAVE' :
          typeStr === 'Izin Sakit' || typeStr === 'Sakit' ? 'SICK' :
          typeStr === 'Dinas Luar' || typeStr === 'Dinas' ? 'BUSINESS_TRIP' :
          typeStr === 'Koreksi' ? 'CORRECTION' : 'PERMISSION'
        ) as any,
        startDate: item.startDate,
        endDate: item.endDate,
        reason: item.reason,
      });

      await loadDataFromApi();
      addToast('success', `Pengajuan ${item.type} Terkirim`, 'Permohonan Anda sedang menunggu persetujuan atasan/HR.');
    } catch (err: any) {
      addToast('error', `Pengajuan Gagal`, err?.message || 'Terjadi kesalahan saat mengirim permohonan.');
    }
  };

  const handleCancelRequest = async (id: string) => {
    try {
      await apiClient.request(`/requests/${id}/cancel`, { method: 'POST' });
      await loadDataFromApi();
      addToast('info', 'Pengajuan Dibatalkan', 'Permohonan telah dibatalkan.');
    } catch (err: any) {
      // Fallback: update locally if API endpoint not yet available
      setRequests((prev) => prev.map((r) => (r.id === id ? { ...r, status: 'Cancelled' } : r)));
      addToast('info', 'Pengajuan Dibatalkan', 'Permohonan telah dibatalkan.');
    }
  };

  // ── Approval Handlers — API-first (BR-APP-001, BR-APP-002, BR-LEAVE-001) ──
  const handleApproveRequest = async (id: string, note?: string) => {
    const approvedItem = requests.find((r) => r.id === id);
    if (!approvedItem) return;

    // Prevent self-approval
    if (approvedItem.employeeId === currentUser.employeeId) {
      addToast('error', 'Akses Ditolak', 'Self-Approval dilarang oleh sistem.');
      return;
    }

    try {
      // PRIMARY: API call — server handles leave balance deduction atomically
      await apiClient.approveRequest(id, note);

      // SECONDARY: Refresh all data (leave balance, requests, etc.) from DB
      await loadDataFromApi();

      addToast('success', 'Pengajuan Disetujui', `Permohonan ${approvedItem?.employeeName} telah di-approve.`);
    } catch (err: any) {
      addToast('error', 'Approval Gagal', err?.message || 'Terjadi kesalahan saat menyetujui pengajuan.');
    }
  };

  const handleRejectRequest = async (id: string, note?: string) => {
    const rejectedItem = requests.find((r) => r.id === id);

    try {
      await apiClient.rejectRequest(id, note);
      await loadDataFromApi();
      addToast('error', 'Pengajuan Ditolak', `Permohonan ${rejectedItem?.employeeName} telah ditolak.`);
    } catch (err: any) {
      addToast('error', 'Reject Gagal', err?.message || 'Terjadi kesalahan saat menolak pengajuan.');
    }
  };

  // ── Employee CRUD handlers ──
  const handleAddEmployee = (newEmp: User) => {
    setEmployees((prev) => [...prev, newEmp]);
    apiClient
      .createEmployee({
        fullName: newEmp.name,
        email: newEmp.email,
        phone: newEmp.phone,
        role: newEmp.role.toLowerCase(),
        departmentId: newEmp.department,
        positionId: newEmp.position,
        employeeCode: newEmp.employeeId,
      })
      .then(() => loadDataFromApi())
      .catch((e) => console.warn('Backend create employee error:', e));

    addToast('success', 'Karyawan Didaftarkan', `${newEmp.name} (${newEmp.employeeId}) berhasil ditambahkan.`);
  };

  const handleUpdateEmployee = (updatedEmp: User) => {
    setEmployees((prev) => prev.map((e) => (e.id === updatedEmp.id ? updatedEmp : e)));
    apiClient
      .updateEmployee(updatedEmp.id, {
        fullName: updatedEmp.name,
        phone: updatedEmp.phone,
        status: updatedEmp.status,
      })
      .then(() => loadDataFromApi())
      .catch((e) => console.warn('Backend update employee error:', e));

    addToast('success', 'Data Disimpan', `Profil karyawan ${updatedEmp.name} telah diperbarui.`);
  };

  const handleDeleteEmployee = (id: string) => {
    const emp = employees.find((e) => e.id === id);
    setEmployees((prev) => prev.filter((e) => e.id !== id));
    apiClient
      .deleteEmployee(id)
      .then(() => loadDataFromApi())
      .catch((e) => console.warn('Backend delete employee error:', e));

    addToast('info', 'Karyawan Dinonaktifkan', `Akun ${emp?.name} telah dinonaktifkan dari sistem.`);
  };

  // ── Geofence handlers ──
  const handleAddLocation = (loc: GeofenceLocation) => {
    setGeofences((prev) => [...prev, loc]);
    apiClient
      .createLocation({
        name: loc.name,
        address: loc.address,
        latitude: loc.latitude,
        longitude: loc.longitude,
        radiusMeters: loc.radiusMeters,
      })
      .then(() => loadDataFromApi())
      .catch((e) => console.warn('Backend create location error:', e));

    addToast('success', 'Lokasi Kantor Ditambahkan', `${loc.name} dengan radius ${loc.radiusMeters}m aktif.`);
  };

  const handleUpdateLocation = (loc: GeofenceLocation) => {
    setGeofences((prev) => prev.map((l) => (l.id === loc.id ? loc : l)));
    apiClient
      .updateLocation(loc.id, {
        name: loc.name,
        address: loc.address,
        latitude: loc.latitude,
        longitude: loc.longitude,
        radiusMeters: loc.radiusMeters,
      })
      .then(() => loadDataFromApi())
      .catch((e) => console.warn('Backend update location error:', e));

    addToast('success', 'Geofence Diperbarui', `Batas radius ${loc.name} berhasil disimpan.`);
  };

  const handleDeleteLocation = (id: string) => {
    setGeofences((prev) => prev.filter((l) => l.id !== id));
    apiClient
      .deleteLocation(id)
      .then(() => loadDataFromApi())
      .catch((e) => console.warn('Backend delete location error:', e));

    addToast('info', 'Lokasi Kantor Dihapus', 'Lokasi kantor telah dihapus dari sistem absensi.');
  };

  // ── Device handlers ──
  const handleUnbindDevice = (id: string) => {
    setDevices((prev) => prev.filter((d) => d.id !== id));
    apiClient
      .deleteDevice(id)
      .then(() => loadDataFromApi())
      .catch((e) => console.warn('Backend delete device error:', e));

    addToast('info', 'Device Unbound', 'Tautan perangkat berhasil dilepas.');
  };

  const handleDisableDevice = (id: string) => {
    setDevices((prev) => prev.map((d) => (d.id === id ? { ...d, status: 'Disabled' } : d)));
    apiClient
      .updateDeviceStatus(id, 'BLOCKED')
      .then(() => loadDataFromApi())
      .catch((e) => console.warn('Backend block device error:', e));

    addToast('error', 'Device Disabled', 'Perangkat dibekukan dari sistem absensi.');
  };

  // ── Security Event Resolve ──
  const handleResolveEvent = (id: string) => {
    setSecurityEvents((prev) => prev.map((e) => (e.id === id ? { ...e, status: 'Resolved' } : e)));
    setAuditLogs((prev) => [
      {
        id: `aud-${Date.now()}`,
        timestamp: `${getTodayDateString()} ${formatTimeWIB()}`,
        user: `${currentUser.name} (${currentUser.employeeId})`,
        action: 'SECURITY_ALERT',
        module: 'Security',
        ip: '127.0.0.1',
        device: 'Admin Console',
        result: 'SUCCESS',
        details: `Insiden keamanan ID ${id} diselesaikan (Resolved)`,
      },
      ...prev,
    ]);
    addToast('success', 'Insiden Diselesaikan', 'Status investigasi keamanan ditandai Resolved.');
  };

  // ── Holiday handlers ──
  const handleAddHoliday = (hol: HolidayItem) => {
    setHolidays((prev) => [...prev, hol]);
    apiClient
      .createHoliday({
        name: hol.name,
        date: hol.date,
        type: hol.type === 'Nasional' ? 'NATIONAL' : hol.type === 'Perusahaan' ? 'COMPANY' : 'CUSTOM',
        description: hol.description,
      })
      .then(() => loadDataFromApi())
      .catch((e) => console.warn('Backend create holiday error:', e));

    setAuditLogs((prev) => [
      {
        id: `aud-${Date.now()}`,
        timestamp: `${getTodayDateString()} ${formatTimeWIB()}`,
        user: `${currentUser.name} (${currentUser.employeeId})`,
        action: 'SETTINGS_CHANGED',
        module: 'System',
        ip: '127.0.0.1',
        device: 'Admin Console',
        result: 'SUCCESS',
        details: `Hari libur ditambahkan: ${hol.name} (${hol.date}) - ${hol.type}`,
      },
      ...prev,
    ]);
    addToast('success', 'Hari Libur Ditambahkan', `${hol.name} (${hol.date}) tercatat di kalender.`);
  };

  const handleDeleteHoliday = (id: string) => {
    const targetHol = holidays.find((h) => h.id === id);
    setHolidays((prev) => prev.filter((h) => h.id !== id));
    apiClient
      .deleteHoliday(id)
      .then(() => loadDataFromApi())
      .catch((e) => console.warn('Backend delete holiday error:', e));

    setAuditLogs((prev) => [
      {
        id: `aud-${Date.now()}`,
        timestamp: `${getTodayDateString()} ${formatTimeWIB()}`,
        user: `${currentUser.name} (${currentUser.employeeId})`,
        action: 'SETTINGS_CHANGED',
        module: 'System',
        ip: '127.0.0.1',
        device: 'Admin Console',
        result: 'SUCCESS',
        details: `Hari libur dihapus: ${targetHol ? targetHol.name : id}`,
      },
      ...prev,
    ]);
    addToast('info', 'Hari Libur Dihapus', 'Jadwal libur telah dihapus.');
  };

  // ── System Settings handler ──
  const handleSaveSystemSettings = (newSettings: SystemSettings) => {
    setSystemSettings(newSettings);
    apiClient
      .updateSettings({
        grace_period_minutes: newSettings.gracePeriod,
        require_selfie: newSettings.requiredSelfie,
        require_liveness: newSettings.livenessDetection,
        require_geofence: newSettings.geofenceRequired,
        company_name: newSettings.companyName,
        work_start_time: newSettings.workStartTime,
        work_end_time: newSettings.workEndTime,
      })
      .then(() => loadDataFromApi())
      .catch((e) => console.warn('Backend update settings error:', e));

    setAuditLogs((prev) => [
      {
        id: `aud-${Date.now()}`,
        timestamp: `${getTodayDateString()} ${formatTimeWIB()}`,
        user: `${currentUser.name} (${currentUser.employeeId})`,
        action: 'SETTINGS_CHANGED',
        module: 'System',
        ip: '127.0.0.1',
        device: 'Admin Console',
        result: 'SUCCESS',
        details: `Konfigurasi sistem diperbarui: Grace ${newSettings.gracePeriod}m, Selfie: ${newSettings.requiredSelfie}, Geofence: ${newSettings.geofenceRequired}`,
      },
      ...prev,
    ]);
    addToast('success', 'Pengaturan Disimpan', 'Konfigurasi parameter operasional sistem berhasil disimpan.');
  };

  // ── Notification handlers — API-first ──
  const handleMarkNotificationAsRead = async (id: string) => {
    // Optimistic local update for instant UI feedback
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, unread: false } : n)));
    // Persist to DB
    apiClient.markNotificationAsRead(id).catch(() => {});
  };

  const handleMarkAllNotificationsRead = async () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
    await apiClient.markAllNotificationsAsRead().catch(() => {});
    addToast('info', 'Notifikasi Dibaca', 'Semua notifikasi ditandai sudah dibaca.');
  };

  // ── View modes ──
  if (viewMode === 'landing') {
    return (
      <>
        <LandingPage
          onLoginClick={() => setViewMode('login')}
          onEnterApp={() => setViewMode('app')}
          isLoggedIn={isLoggedIn}
        />
        <ToastContainer toasts={toasts} onDismiss={dismissToast} />
      </>
    );
  }

  if (viewMode === 'login' || !isLoggedIn) {
    return (
      <>
        <LoginPage
          onLogin={(authUser) => handleLogin(authUser)}
          onBackToLanding={() => setViewMode('landing')}
        />
        <ToastContainer toasts={toasts} onDismiss={dismissToast} />
      </>
    );
  }

  const todayRecordForUser = todayAttendance.find((r) => r.employeeId === currentUser.employeeId);
  const pendingApprovalsCount = requests.filter((r) => r.status === 'Pending').length;

  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900 flex flex-col antialiased">
      {/* Sidebar Navigation */}
      <Sidebar
        currentRoute={currentRoute}
        onNavigate={setCurrentRoute}
        userRole={currentUser.role}
        pendingApprovalsCount={pendingApprovalsCount}
        isOpenMobile={isSidebarOpenMobile}
        onCloseMobile={() => setIsSidebarOpenMobile(false)}
        onOpenCommandMenu={() => setIsCommandMenuOpen(true)}
        currentUser={currentUser}
      />

      {/* Main Content Layout */}
      <div className="lg:pl-64 flex flex-col flex-1 min-h-screen">
        {/* Topbar */}
        <Topbar
          currentRoute={currentRoute}
          onToggleSidebar={() => setIsSidebarOpenMobile(!isSidebarOpenMobile)}
          notifications={notifications}
          onMarkNotificationAsRead={handleMarkNotificationAsRead}
          onMarkAllNotificationsRead={handleMarkAllNotificationsRead}
          onLogout={handleLogout}
          onNavigate={setCurrentRoute}
          onOpenCommandMenu={() => setIsCommandMenuOpen(true)}
          onGoToLanding={() => setViewMode('landing')}
          currentUser={currentUser}
        />

        {/* Dynamic Route Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto pb-24 lg:pb-12">
          {(() => {
            const currentNavDef = CENTRAL_NAVIGATION.find((item) => item.id === currentRoute);
            const isRouteAuthorized =
              !currentNavDef?.requiredPermissions ||
              hasPermission(currentUser.role, currentNavDef.requiredPermissions);

            if (!isRouteAuthorized) {
              return (
                <div className="p-8 max-w-lg mx-auto my-12 bg-white rounded-3xl border border-rose-200 shadow-sm text-center space-y-4">
                  <div className="w-14 h-14 bg-rose-50 text-rose-600 rounded-2xl flex items-center justify-center mx-auto">
                    <ShieldAlert className="w-7 h-7" />
                  </div>
                  <h3 className="text-base font-bold text-neutral-900">Akses Ditolak (403 Forbidden)</h3>
                  <p className="text-xs text-neutral-500">
                    Akun Anda dengan role <strong>{currentUser.role}</strong> tidak memiliki izin untuk mengakses rute <code>{currentRoute}</code>.
                  </p>
                  <button
                    type="button"
                    onClick={() => setCurrentRoute('dashboard')}
                    className="px-4 py-2 bg-neutral-900 text-white text-xs font-semibold rounded-xl hover:bg-neutral-800 transition"
                  >
                    Kembali ke Dashboard
                  </button>
                </div>
              );
            }

            return (
              <>
                {currentRoute === 'dashboard' && currentUser.role === 'Employee' && (
                  <EmployeeDashboard
                    user={currentUser}
                    todayRecord={todayRecordForUser}
                    recentHistory={historyAttendance}
                    onNavigate={setCurrentRoute}
                    onOpenCheckIn={() => setCurrentRoute('check-in')}
                    onOpenCheckOut={() => setCurrentRoute('check-out')}
                  />
                )}

                {((currentRoute === 'dashboard' && currentUser.role !== 'Employee') || currentRoute === 'admin-dashboard') && (
                  <AdminDashboard
                    todayAttendance={todayAttendance}
                    pendingRequests={requests.filter((r) => r.status === 'Pending')}
                    securityEvents={securityEvents}
                    employees={employees}
                    onNavigate={setCurrentRoute}
                    onApproveRequest={handleApproveRequest}
                    onRejectRequest={handleRejectRequest}
                  />
                )}

                {currentRoute === 'kehadiran' && (
                  <KehadiranPage
                    user={currentUser}
                    todayRecord={todayRecordForUser}
                    onSuccessCheckIn={handleSuccessCheckIn}
                    onSuccessCheckOut={handleSuccessCheckOut}
                    onAddDinasRequest={handleAddRequest}
                    onNavigate={setCurrentRoute}
                  />
                )}

                {currentRoute === 'tim-saya' && (
                  <TimSayaPage
                    currentUser={currentUser}
                    employees={employees}
                    todayAttendance={todayAttendance}
                    requests={requests}
                    onApproveRequest={handleApproveRequest}
                    onRejectRequest={handleRejectRequest}
                  />
                )}

                {currentRoute === 'check-in' && (
                  <CheckInPage
                    user={currentUser}
                    todayRecord={todayRecordForUser}
                    geofences={geofences}
                    onSuccessCheckIn={handleSuccessCheckIn}
                    onNavigate={setCurrentRoute}
                  />
                )}

                {currentRoute === 'check-out' && (
                  <CheckOutPage
                    user={currentUser}
                    todayRecord={todayRecordForUser}
                    onSuccessCheckOut={handleSuccessCheckOut}
                    onNavigate={setCurrentRoute}
                  />
                )}

                {currentRoute === 'dinas' && (
                  <DinasPage
                    user={currentUser}
                    requests={requests}
                    onAddRequest={handleAddRequest}
                  />
                )}

                {currentRoute === 'pengajuan' && (
                  <PengajuanPage
                    user={currentUser}
                    requests={requests}
                    holidays={holidays}
                    onAddRequest={handleAddRequest}
                    onCancelRequest={handleCancelRequest}
                  />
                )}

                {currentRoute === 'cuti' && (
                  <CutiPage
                    user={currentUser}
                    requests={requests}
                    holidays={holidays}
                    onAddRequest={handleAddRequest}
                  />
                )}

                {currentRoute === 'riwayat' && (
                  <RiwayatKehadiranPage
                    currentEmployeeId={currentUser.employeeId}
                    history={historyAttendance}
                    isAdmin={currentUser.role === 'Admin' || currentUser.role === 'Superadmin' || currentUser.role === 'HR'}
                    onBulkDelete={handleBulkDeleteAttendance}
                  />
                )}

                {currentRoute === 'laporan' && (
                  <LaporanPage
                    records={historyAttendance}
                    employees={employees}
                    onSyncGoogleSheets={() => {
                      setCurrentRoute('integrasi-sheets');
                      addToast('info', 'Google Sheets Integration', 'Membuka konfigurasi sinkronisasi spreadsheet.');
                    }}
                  />
                )}

                {currentRoute === 'kalender' && (
                  <CalendarHolidaysPage
                    holidays={holidays}
                    onAddHoliday={handleAddHoliday}
                    onDeleteHoliday={handleDeleteHoliday}
                    userRole={currentUser.role}
                    isSuperadmin={currentUser.role === 'Superadmin'}
                  />
                )}

                {currentRoute === 'profil' && (
                  <ProfilePage
                    user={currentUser}
                    onNavigate={setCurrentRoute}
                    onUpdatePhone={(newPhone) => {
                      setCurrentUser((prev) => ({ ...prev, phone: newPhone }));
                      addToast('success', 'Nomor HP Diperbarui', `Kontak aktif: ${newPhone}`);
                    }}
                  />
                )}

                {currentRoute === 'face-verification' && (
                  <FaceVerificationPage user={currentUser} />
                )}

                {currentRoute === 'devices-admin' && (
                  hasPermission(currentUser.role, ['device.manage']) ? (
                    <DevicesAdminPage
                      devices={devices}
                      onUnbindDevice={handleUnbindDevice}
                      onDisableDevice={handleDisableDevice}
                    />
                  ) : (
                    <div className="max-w-md mx-auto py-16 text-center">
                      <div className="p-6 bg-rose-50 border border-rose-200 rounded-2xl text-rose-800 text-sm font-medium">
                        Akses Ditolak: Anda tidak memiliki izin untuk mengelola inventaris perangkat organisasi.
                      </div>
                    </div>
                  )
                )}

                {currentRoute === 'perangkat' && (
                  hasPermission(currentUser.role, ['device.manage']) ? (
                    <DevicesAdminPage
                      devices={devices}
                      onUnbindDevice={handleUnbindDevice}
                      onDisableDevice={handleDisableDevice}
                    />
                  ) : (
                    <DevicePage user={currentUser} devices={devices} />
                  )
                )}

                {/* Admin Routes */}
                {(currentRoute === 'approval' || currentRoute === 'persetujuan') && (
                  <ApprovalPage
                    currentUser={currentUser}
                    requests={requests}
                    onApprove={handleApproveRequest}
                    onReject={handleRejectRequest}
                  />
                )}

                {(currentRoute === 'employees' || currentRoute === 'karyawan') && (
                  <EmployeeManagementPage
                    employees={employees}
                    onAddEmployee={handleAddEmployee}
                    onUpdateEmployee={handleUpdateEmployee}
                    onDeleteEmployee={handleDeleteEmployee}
                  />
                )}

                {currentRoute === 'geofence' && (
                  <GeofencePage
                    locations={geofences}
                    onAddLocation={handleAddLocation}
                    onUpdateLocation={handleUpdateLocation}
                    onDeleteLocation={handleDeleteLocation}
                  />
                )}

                {(currentRoute === 'audit-trail' || currentRoute === 'audit-security') && (
                  <AuditTrailPage logs={auditLogs} />
                )}

                {currentRoute === 'security-events' && (
                  <SecurityEventsPage
                    events={securityEvents}
                    onResolveEvent={handleResolveEvent}
                  />
                )}

                {currentRoute === 'roles-permissions' && <RolesPermissionsPage />}

                {(currentRoute === 'google-sheets' || currentRoute === 'integrasi-sheets') && (
                  <GoogleSheetsPage />
                )}

                {(currentRoute === 'google-drive' || currentRoute === 'integrasi-drive') && (
                  <GoogleDrivePage />
                )}

                {(currentRoute === 'telegram-bot' || currentRoute === 'integrasi-telegram') && (
                  <TelegramBotPage />
                )}

                {(currentRoute === 'security-2fa' || currentRoute === 'keamanan-2fa') && (
                  <Security2FAPage />
                )}

                {currentRoute === 'payroll' && (
                  <PayrollPage payrollData={[]} />
                )}

                {(currentRoute === 'system-settings' || currentRoute === 'pengaturan') && (
                  <SystemSettingsPage
                    settings={systemSettings}
                    onSaveSettings={handleSaveSystemSettings}
                  />
                )}
              </>
            );
          })()}
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <MobileNav
        currentRoute={currentRoute}
        onNavigate={setCurrentRoute}
        onOpenSidebar={() => setIsSidebarOpenMobile(true)}
        userRole={currentUser.role}
        pendingApprovalsCount={pendingApprovalsCount}
      />

      {/* Global Command Menu (⌘K / Ctrl+K) */}
      <CommandMenu
        isOpen={isCommandMenuOpen}
        onClose={() => setIsCommandMenuOpen(false)}
        onNavigate={setCurrentRoute}
        userRole={currentUser.role}
      />

      {/* Global Toast Notification Container */}
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
    </div>
  );
}
