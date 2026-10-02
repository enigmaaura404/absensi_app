import React, { useState, useEffect } from 'react';
import {
  CURRENT_USER_EMPLOYEE,
  CURRENT_USER_ADMIN,
  CURRENT_USER_SUPERADMIN,
  MOCK_EMPLOYEES,
  INITIAL_TODAY_ATTENDANCE,
  MOCK_HISTORY_ATTENDANCE,
  MOCK_REQUESTS,
  MOCK_GEOFENCES,
  MOCK_DEVICES,
  MOCK_HOLIDAYS,
  MOCK_AUDIT_LOGS,
  MOCK_SECURITY_EVENTS,
  MOCK_NOTIFICATIONS,
  MOCK_PAYROLL_PREPARATION,
} from './data/mockData';
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
  PayrollPrepItem,
} from './types';

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
import { SystemSettingsPage } from './pages/admin/SystemSettingsPage';

export default function App() {
  // Authentication & Role State
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [viewMode, setViewMode] = useState<'landing' | 'login' | 'app'>('landing');
  const [currentUserRole, setCurrentUserRole] = useState<UserRole>('Employee');
  const [currentUser, setCurrentUser] = useState<User>(CURRENT_USER_EMPLOYEE);

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

  // App Data States
  const [employees, setEmployees] = useState<User[]>(MOCK_EMPLOYEES);
  const [todayAttendance, setTodayAttendance] = useState<AttendanceRecord[]>(INITIAL_TODAY_ATTENDANCE);
  const [historyAttendance, setHistoryAttendance] = useState<AttendanceRecord[]>(MOCK_HISTORY_ATTENDANCE);
  const [requests, setRequests] = useState<RequestItem[]>(MOCK_REQUESTS);
  const [geofences, setGeofences] = useState<GeofenceLocation[]>(MOCK_GEOFENCES);
  const [devices, setDevices] = useState<DeviceItem[]>(MOCK_DEVICES);
  const [holidays, setHolidays] = useState<HolidayItem[]>(MOCK_HOLIDAYS);
  const [auditLogs, setAuditLogs] = useState<AuditLogItem[]>(MOCK_AUDIT_LOGS);
  const [securityEvents, setSecurityEvents] = useState<SecurityEventItem[]>(MOCK_SECURITY_EVENTS);
  const [notifications, setNotifications] = useState<NotificationItem[]>(MOCK_NOTIFICATIONS);
  const [payrollData] = useState<PayrollPrepItem[]>(MOCK_PAYROLL_PREPARATION);

  // Toast System
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = (type: 'success' | 'error' | 'info', title: string, message?: string) => {
    const id = `toast-${Date.now()}-${Math.random()}`;
    setToasts((prev) => [...prev, { id, type, title, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const getUserForRole = (role: UserRole): User => {
    switch (role) {
      case 'Employee':
        return CURRENT_USER_EMPLOYEE;
      case 'Supervisor':
        return {
          ...CURRENT_USER_EMPLOYEE,
          id: 'usr-spv',
          employeeId: 'EMP-00045',
          name: 'Ahmad Fauzi, S.T.',
          email: 'ahmad.fauzi@company.id',
          role: 'Supervisor',
          department: 'Technology',
          position: 'Engineering Team Lead',
          avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=256&q=80',
        };
      case 'Manager':
        return {
          ...CURRENT_USER_EMPLOYEE,
          id: 'usr-mgr',
          employeeId: 'EMP-00022',
          name: 'Irwan Setiawan, M.M.',
          email: 'irwan.setiawan@company.id',
          role: 'Manager',
          department: 'Operations & Engineering',
          position: 'Head of Operations',
          avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=256&q=80',
        };
      case 'HR':
        return CURRENT_USER_ADMIN;
      case 'Admin':
        return {
          ...CURRENT_USER_ADMIN,
          id: 'usr-adm',
          employeeId: 'EMP-00005',
          name: 'Bambang Soediro',
          email: 'bambang.s@company.id',
          role: 'Admin',
          department: 'General Affairs',
          position: 'Senior Operations Admin',
          avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=256&q=80',
        };
      case 'Superadmin':
      default:
        return CURRENT_USER_SUPERADMIN;
    }
  };

  // Login handler
  const handleLogin = (role: UserRole) => {
    setIsLoggedIn(true);
    setCurrentUserRole(role);
    const targetUser = getUserForRole(role);
    setCurrentUser(targetUser);
    setCurrentRoute('dashboard');
    setViewMode('app');
    addToast('success', `Berhasil Masuk sebagai ${role}`, `Selamat datang, ${targetUser.name}`);
  };

  // Logout handler
  const handleLogout = () => {
    setIsLoggedIn(false);
    setViewMode('landing');
    addToast('info', 'Anda telah keluar', 'Sesi login telah diakhiri.');
  };

  // Role Switcher handler (For demo purposes)
  const handleChangeRole = (role: UserRole) => {
    setCurrentUserRole(role);
    const targetUser = getUserForRole(role);
    setCurrentUser(targetUser);
    setCurrentRoute('dashboard');
    addToast('info', `Mode Akses Berubah`, `Anda sekarang melihat aplikasi dengan role: ${role}`);
  };

  // Check-In Success handler
  const handleSuccessCheckIn = (time: string, location: string) => {
    const updatedToday: AttendanceRecord = {
      id: `att-now-${Date.now()}`,
      employeeId: currentUser.employeeId,
      employeeName: currentUser.name,
      department: currentUser.department,
      date: '2026-10-02',
      checkInTime: time.replace(' WIB', ''),
      checkOutTime: null,
      status: 'Hadir',
      duration: 'Berjalan',
      location: location,
      coordinates: '-6.917464, 107.619123',
      device: 'Samsung Galaxy S24 Ultra',
      ip: '182.253.14.88',
      selfieUrl: currentUser.avatar,
      notes: 'Check-in sukses terverifikasi biometrik',
    };

    setTodayAttendance((prev) => [updatedToday, ...prev.filter((r) => r.employeeId !== currentUser.employeeId)]);
    setHistoryAttendance((prev) => [updatedToday, ...prev]);

    // Add Audit log
    setAuditLogs((prev) => [
      {
        id: `aud-${Date.now()}`,
        timestamp: `02 Oct 2026 ${time}`,
        user: `${currentUser.name} (${currentUser.employeeId})`,
        action: 'CHECK_IN',
        module: 'Attendance',
        ip: '182.253.14.88',
        device: 'Samsung Galaxy S24 Ultra',
        result: 'SUCCESS',
        details: `Check-in di ${location}`,
      },
      ...prev,
    ]);

    // Add Notification
    setNotifications((prev) => [
      {
        id: `notif-${Date.now()}`,
        title: 'Check-In Berhasil',
        message: `Absensi masuk pukul ${time} di ${location} berhasil diverifikasi.`,
        category: 'Attendance',
        timestamp: time,
        unread: true,
      },
      ...prev,
    ]);

    addToast('success', 'Check-In Berhasil', `Absensi masuk tercatat pukul ${time}`);
  };

  // Bulk Delete Attendance Records handler
  const handleBulkDeleteAttendance = (ids: string[]) => {
    const idSet = new Set(ids);
    setHistoryAttendance((prev) => prev.filter((item) => !idSet.has(item.id)));
    setTodayAttendance((prev) => prev.filter((item) => !idSet.has(item.id)));

    // Audit log
    setAuditLogs((prev) => [
      {
        id: `aud-${Date.now()}`,
        timestamp: `02 Oct 2026 ${new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}`,
        user: `${currentUser.name} (${currentUser.role})`,
        action: 'SETTINGS_CHANGED',
        module: 'Attendance',
        ip: '182.253.14.88',
        device: 'Admin Control Console',
        result: 'SUCCESS',
        details: `Menghapus massal ${ids.length} catatan kehadiran.`,
      },
      ...prev,
    ]);

    addToast('success', 'Hapus Massal Berhasil', `${ids.length} data absensi telah dihapus dari sistem.`);
  };

  // Check-Out Success handler
  const handleSuccessCheckOut = (time: string) => {
    setTodayAttendance((prev) =>
      prev.map((r) => {
        if (r.employeeId === currentUser.employeeId) {
          return {
            ...r,
            checkOutTime: time.replace(' WIB', ''),
            duration: '9j 03m',
          };
        }
        return r;
      })
    );

    setHistoryAttendance((prev) =>
      prev.map((r) => {
        if (r.employeeId === currentUser.employeeId && r.date === '2026-10-02') {
          return {
            ...r,
            checkOutTime: time.replace(' WIB', ''),
            duration: '9j 03m',
          };
        }
        return r;
      })
    );

    setAuditLogs((prev) => [
      {
        id: `aud-${Date.now()}`,
        timestamp: `02 Oct 2026 ${time}`,
        user: `${currentUser.name} (${currentUser.employeeId})`,
        action: 'CHECK_OUT',
        module: 'Attendance',
        ip: '182.253.14.88',
        device: 'Samsung Galaxy S24 Ultra',
        result: 'SUCCESS',
        details: 'Check-out berhasil. Durasi kerja: 9j 03m',
      },
      ...prev,
    ]);

    addToast('success', 'Check-Out Berhasil', `Absensi pulang tercatat pukul ${time}. Selamat beristirahat!`);
  };

  // Add Request handler (Cuti, Sakit, Izin, Dinas, Koreksi)
  const handleAddRequest = (item: RequestItem) => {
    setRequests((prev) => [item, ...prev]);

    // Audit log
    setAuditLogs((prev) => [
      {
        id: `aud-${Date.now()}`,
        timestamp: `02 Oct 2026 ${new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}`,
        user: `${item.employeeName} (${item.employeeId})`,
        action: 'LEAVE_APPLY',
        module: 'Approval',
        ip: '182.253.14.88',
        device: 'Samsung Galaxy S24 Ultra',
        result: 'SUCCESS',
        details: `Pengajuan ${item.type}: ${item.reason}`,
      },
      ...prev,
    ]);

    addToast('success', `Pengajuan ${item.type} Terkirim`, 'Permohonan Anda sedang menunggu persetujuan atasan/HR.');
  };

  const handleCancelRequest = (id: string) => {
    setRequests((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: 'Cancelled' } : r))
    );
    addToast('info', 'Pengajuan Dibatalkan', 'Permohonan telah dibatalkan.');
  };

  // Approval Handlers
  const handleApproveRequest = (id: string, note?: string) => {
    setRequests((prev) =>
      prev.map((r) =>
        r.id === id
          ? {
              ...r,
              status: 'Approved',
              approvedAt: `02 Oct 2026 ${new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}`,
              approverName: currentUser.name,
              notes: note,
            }
          : r
      )
    );

    const approvedItem = requests.find((r) => r.id === id);

    setAuditLogs((prev) => [
      {
        id: `aud-${Date.now()}`,
        timestamp: `02 Oct 2026 ${new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}`,
        user: `${currentUser.name} (${currentUser.role})`,
        action: 'APPROVAL_GRANTED',
        module: 'Approval',
        ip: '182.253.14.89',
        device: 'HR Management Console',
        result: 'SUCCESS',
        details: `Menyetujui pengajuan ${approvedItem?.type} untuk ${approvedItem?.employeeName}`,
      },
      ...prev,
    ]);

    addToast('success', 'Pengajuan Disetujui', `Permohonan ${approvedItem?.employeeName} telah di-approve.`);
  };

  const handleRejectRequest = (id: string, note?: string) => {
    setRequests((prev) =>
      prev.map((r) =>
        r.id === id
          ? {
              ...r,
              status: 'Rejected',
              rejectionReason: note,
            }
          : r
      )
    );

    const rejectedItem = requests.find((r) => r.id === id);

    setAuditLogs((prev) => [
      {
        id: `aud-${Date.now()}`,
        timestamp: `02 Oct 2026 ${new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}`,
        user: `${currentUser.name} (${currentUser.role})`,
        action: 'APPROVAL_REJECTED',
        module: 'Approval',
        ip: '182.253.14.89',
        device: 'HR Management Console',
        result: 'SUCCESS',
        details: `Menolak pengajuan ${rejectedItem?.type} untuk ${rejectedItem?.employeeName}`,
      },
      ...prev,
    ]);

    addToast('error', 'Pengajuan Ditolak', `Permohonan ${rejectedItem?.employeeName} telah ditolak.`);
  };

  // Employee CRUD handlers
  const handleAddEmployee = (newEmp: User) => {
    setEmployees((prev) => [...prev, newEmp]);
    addToast('success', 'Karyawan Didaftarkan', `${newEmp.name} (${newEmp.employeeId}) berhasil ditambahkan.`);
  };

  const handleUpdateEmployee = (updatedEmp: User) => {
    setEmployees((prev) => prev.map((e) => (e.id === updatedEmp.id ? updatedEmp : e)));
    addToast('success', 'Data Disimpan', `Profil karyawan ${updatedEmp.name} telah diperbarui.`);
  };

  const handleDeleteEmployee = (id: string) => {
    const emp = employees.find((e) => e.id === id);
    setEmployees((prev) => prev.filter((e) => e.id !== id));
    addToast('info', 'Karyawan Dinonaktifkan', `Akun ${emp?.name} telah dinonaktifkan dari sistem.`);
  };

  // Geofence handlers
  const handleAddLocation = (loc: GeofenceLocation) => {
    setGeofences((prev) => [...prev, loc]);
    addToast('success', 'Lokasi Kantor Ditambahkan', `${loc.name} dengan radius ${loc.radiusMeters}m aktif.`);
  };

  const handleUpdateLocation = (loc: GeofenceLocation) => {
    setGeofences((prev) => prev.map((l) => (l.id === loc.id ? loc : l)));
    addToast('success', 'Geofence Diperbarui', `Batas radius ${loc.name} berhasil disimpan.`);
  };

  const handleDeleteLocation = (id: string) => {
    setGeofences((prev) => prev.filter((l) => l.id !== id));
    addToast('info', 'Lokasi Kantor Dihapus', 'Lokasi kantor telah dihapus dari sistem absensi.');
  };

  // Device handlers
  const handleUnbindDevice = (id: string) => {
    setDevices((prev) => prev.filter((d) => d.id !== id));
    addToast('info', 'Device Unbound', 'Tautan perangkat berhasil dilepas.');
  };

  const handleDisableDevice = (id: string) => {
    setDevices((prev) =>
      prev.map((d) => (d.id === id ? { ...d, status: 'Disabled' } : d))
    );
    addToast('error', 'Device Disabled', 'Perangkat dibekukan dari sistem absensi.');
  };

  // Security Event Resolve
  const handleResolveEvent = (id: string) => {
    setSecurityEvents((prev) =>
      prev.map((e) => (e.id === id ? { ...e, status: 'Resolved' } : e))
    );
    addToast('success', 'Insiden Diselesaikan', 'Status investigasi keamanan ditandai Resolved.');
  };

  // Holiday handlers
  const handleAddHoliday = (hol: HolidayItem) => {
    setHolidays((prev) => [...prev, hol]);
    addToast('success', 'Hari Libur Ditambahkan', `${hol.name} (${hol.date}) tercatat di kalender.`);
  };

  const handleDeleteHoliday = (id: string) => {
    setHolidays((prev) => prev.filter((h) => h.id !== id));
    addToast('info', 'Hari Libur Dihapus', 'Jadwal libur telah dihapus.');
  };

  // Notification read handlers
  const handleMarkNotificationAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, unread: false } : n))
    );
  };

  const handleMarkAllNotificationsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
    addToast('info', 'Notifikasi Dibaca', 'Semua notifikasi ditandai sudah dibaca.');
  };

  // 1. Public Website Landing Page (Accessible without login at /)
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

  // 2. Authentication Login Screen
  if (viewMode === 'login' || !isLoggedIn) {
    return (
      <>
        <LoginPage
          onLogin={handleLogin}
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
        userRole={currentUserRole}
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
          userRole={currentUserRole}
          onChangeRole={handleChangeRole}
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
          {currentRoute === 'dashboard' && currentUserRole === 'Employee' && (
            <EmployeeDashboard
              user={currentUser}
              todayRecord={todayRecordForUser}
              recentHistory={historyAttendance}
              onNavigate={setCurrentRoute}
              onOpenCheckIn={() => setCurrentRoute('check-in')}
              onOpenCheckOut={() => setCurrentRoute('check-out')}
            />
          )}

          {((currentRoute === 'dashboard' && currentUserRole !== 'Employee') || currentRoute === 'admin-dashboard') && (
            <AdminDashboard
              todayAttendance={todayAttendance}
              pendingRequests={requests.filter((r) => r.status === 'Pending')}
              securityEvents={securityEvents}
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
            <TimSayaPage />
          )}

          {currentRoute === 'check-in' && (
            <CheckInPage
              onSuccessCheckIn={handleSuccessCheckIn}
              onNavigate={setCurrentRoute}
            />
          )}

          {currentRoute === 'check-out' && (
            <CheckOutPage
              onSuccessCheckOut={handleSuccessCheckOut}
              onNavigate={setCurrentRoute}
            />
          )}

          {currentRoute === 'dinas' && (
            <DinasPage
              requests={requests}
              onAddRequest={handleAddRequest}
            />
          )}

          {currentRoute === 'pengajuan' && (
            <PengajuanPage
              requests={requests}
              onAddRequest={handleAddRequest}
              onCancelRequest={handleCancelRequest}
            />
          )}

          {currentRoute === 'cuti' && (
            <CutiPage
              user={currentUser}
              requests={requests}
              onAddRequest={handleAddRequest}
            />
          )}

          {currentRoute === 'riwayat' && (
            <RiwayatKehadiranPage
              history={historyAttendance}
              isAdmin={currentUserRole === 'Admin' || currentUserRole === 'Superadmin' || currentUserRole === 'HR'}
              onBulkDelete={handleBulkDeleteAttendance}
            />
          )}

          {currentRoute === 'laporan' && (
            <LaporanPage
              records={historyAttendance}
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
              userRole={currentUserRole}
              isSuperadmin={currentUserRole === 'Superadmin'}
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
            <FaceVerificationPage
              user={currentUser}
            />
          )}

          {(currentRoute === 'perangkat' || currentRoute === 'devices-admin') && (
            currentUserRole === 'Employee' ? (
              <DevicePage />
            ) : (
              <DevicesAdminPage
                devices={devices}
                onUnbindDevice={handleUnbindDevice}
                onDisableDevice={handleDisableDevice}
              />
            )
          )}

          {/* Admin Routes */}
          {(currentRoute === 'approval' || currentRoute === 'persetujuan') && (
            <ApprovalPage
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
            <AuditTrailPage
              logs={auditLogs}
            />
          )}

          {currentRoute === 'security-events' && (
            <SecurityEventsPage
              events={securityEvents}
              onResolveEvent={handleResolveEvent}
            />
          )}

          {currentRoute === 'roles-permissions' && (
            <RolesPermissionsPage />
          )}

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
            <PayrollPage
              payrollData={payrollData}
            />
          )}

          {(currentRoute === 'system-settings' || currentRoute === 'pengaturan') && (
            <SystemSettingsPage />
          )}
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <MobileNav
        currentRoute={currentRoute}
        onNavigate={setCurrentRoute}
        onOpenSidebar={() => setIsSidebarOpenMobile(true)}
        userRole={currentUserRole}
        pendingApprovalsCount={pendingApprovalsCount}
      />

      {/* Global Command Menu (⌘K / Ctrl+K) */}
      <CommandMenu
        isOpen={isCommandMenuOpen}
        onClose={() => setIsCommandMenuOpen(false)}
        onNavigate={setCurrentRoute}
        userRole={currentUserRole}
      />

      {/* Global Toast Notification Container */}
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
    </div>
  );
}
