import React, { useState, useEffect } from 'react';
import {
  Bell,
  CheckCircle,
  Clock,
  MapPin,
  Menu,
  Shield,
  User as UserIcon,
  ChevronDown,
  Sparkles,
  LogOut,
  AlertTriangle,
  Info,
  Command,
  Search,
  Globe,
} from 'lucide-react';
import { NotificationItem, User, UserRole } from '../../types';

interface TopbarProps {
  currentRoute: string;
  onToggleSidebar: () => void;
  userRole: UserRole;
  onChangeRole: (role: UserRole) => void;
  notifications: NotificationItem[];
  onMarkNotificationAsRead: (id: string) => void;
  onMarkAllNotificationsRead: () => void;
  onLogout: () => void;
  onNavigate: (route: string) => void;
  onOpenCommandMenu?: () => void;
  onGoToLanding?: () => void;
  currentUser?: User;
}

export const Topbar: React.FC<TopbarProps> = ({
  currentRoute,
  onToggleSidebar,
  userRole,
  onChangeRole,
  notifications,
  onMarkNotificationAsRead,
  onMarkAllNotificationsRead,
  onLogout,
  onNavigate,
  onOpenCommandMenu,
  onGoToLanding,
  currentUser,
}) => {
  const [currentTime, setCurrentTime] = useState<string>('');
  const [showNotifications, setShowNotifications] = useState<boolean>(false);
  const [showProfileMenu, setShowProfileMenu] = useState<boolean>(false);
  const [notificationTab, setNotificationTab] = useState<'All' | 'Attendance' | 'Approval' | 'Security'>('All');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const timeStr = now.toLocaleTimeString('id-ID', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
      });
      setCurrentTime(`${timeStr} WIB`);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const unreadCount = notifications.filter((n) => n.unread).length;

  const getPageInfo = (route: string) => {
    switch (route) {
      case 'dashboard':
        return { title: 'Dashboard', desc: 'Ringkasan presensi harian & aktivitas' };
      case 'kehadiran':
        return { title: 'Kehadiran', desc: 'Check-in, check-out & status biometrik' };
      case 'persetujuan':
        return { title: 'Persetujuan', desc: 'Pusat approval pengajuan staf' };
      case 'tim-saya':
        return { title: 'Tim Saya', desc: 'Kehadiran dan kedisiplinan regu kerja' };
      case 'pengajuan':
        return { title: 'Pengajuan', desc: 'Permohonan izin, sakit, cuti & tugas luar' };
      case 'riwayat':
        return { title: 'Riwayat Kehadiran', desc: 'Logbook presensi terverifikasi' };
      case 'karyawan':
        return { title: 'Karyawan', desc: 'Manajemen direktori staf' };
      case 'laporan':
        return { title: 'Laporan', desc: 'Rekapitulasi dan analisis kehadiran' };
      case 'kalender':
        return { title: 'Kalender & Libur', desc: 'Jadwal hari libur & kerja' };
      case 'geofence':
        return { title: 'Lokasi Kantor', desc: 'Radius GPS kantor & geofencing' };
      case 'perangkat':
        return { title: 'Perangkat', desc: 'Manajemen hardware binding' };
      case 'audit-security':
        return { title: 'Audit & Security', desc: 'Forensik audit & fraud detection' };
      case 'keamanan-2fa':
        return { title: '2FA Superadmin', desc: 'Keamanan Telegram OTP' };
      case 'integrasi-sheets':
        return { title: 'Google Sheets', desc: 'Sinkronisasi spreadsheet' };
      case 'integrasi-drive':
        return { title: 'Google Drive', desc: 'Penyimpanan arsip foto' };
      case 'integrasi-telegram':
        return { title: 'Telegram Bot', desc: 'Alert notifikasi realtime' };
      case 'roles-permissions':
        return { title: 'Access Control (RBAC)', desc: 'Matriks izin role sistem' };
      case 'payroll':
        return { title: 'Payroll Preparation', desc: 'Rekapitulasi cut-off penggajian' };
      case 'pengaturan':
        return { title: 'Pengaturan', desc: 'Konfigurasi sistem & absensi' };
      case 'profil':
        return { title: 'Profil Saya', desc: 'Informasi biodata & keamanan akun' };
      default:
        return { title: 'ATTENDANCE', desc: 'Smart Attendance Management' };
    }
  };

  const pageInfo = getPageInfo(currentRoute);

  return (
    <header className="sticky top-0 z-30 h-16 bg-white/95 backdrop-blur-md border-b border-neutral-200/90 px-4 sm:px-6 flex items-center justify-between">
      {/* Left: Mobile hamburger & Clean Title */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onToggleSidebar}
          className="lg:hidden p-2 -ml-2 rounded-xl text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 transition-colors"
          aria-label="Toggle Menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div>
          <h1 className="text-sm sm:text-base font-bold text-neutral-900 tracking-tight leading-tight">
            {pageInfo.title}
          </h1>
          <p className="text-[11px] text-neutral-400 font-medium hidden sm:block">
            {pageInfo.desc}
          </p>
        </div>
      </div>

      {/* Right: Quick Search Button, Clock, Notifications, Profile / Role Switcher */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Landing Page Public Switcher */}
        {onGoToLanding && (
          <button
            type="button"
            onClick={onGoToLanding}
            className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border border-neutral-200 bg-white hover:bg-neutral-50 text-neutral-700 hover:text-neutral-900 text-xs font-semibold shadow-2xs transition-colors cursor-pointer"
            title="Buka Website Landing Page Publik"
          >
            <Globe className="w-3.5 h-3.5 text-neutral-500" />
            <span>Landing Page</span>
          </button>
        )}

        {/* Global Quick Search Button (Ctrl+K) */}
        {onOpenCommandMenu && (
          <button
            type="button"
            onClick={onOpenCommandMenu}
            className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-xl border border-neutral-200 bg-neutral-50 hover:bg-neutral-100 text-neutral-500 hover:text-neutral-800 text-xs transition-colors shadow-2xs"
            title="Buka Command Menu (⌘K / Ctrl+K)"
          >
            <Search className="w-3.5 h-3.5 text-neutral-400" />
            <span>Cari cepat...</span>
            <kbd className="px-1.5 py-0.2 rounded bg-white text-[10px] font-mono border border-neutral-200 text-neutral-400">
              ⌘K
            </kbd>
          </button>
        )}

        {/* Live Clock Pill */}
        <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-neutral-100 border border-neutral-200/80 text-neutral-800 font-mono text-xs font-semibold">
          <Clock className="w-3.5 h-3.5 text-neutral-500" />
          <span>{currentTime || '08:00 WIB'}</span>
        </div>

        {/* Notification Center */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 rounded-xl text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 transition-colors"
            aria-label="Notifikasi"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-rose-500 text-white text-[9px] font-bold flex items-center justify-center animate-pulse">
                {unreadCount}
              </span>
            )}
          </button>

          {showNotifications && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setShowNotifications(false)} />
              <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl border border-neutral-200 shadow-2xl z-50 overflow-hidden animate-in fade-in-50 zoom-in-95 duration-150">
                <div className="p-3.5 border-b border-neutral-100 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <h4 className="text-xs font-bold text-neutral-900">Notifikasi Sistem</h4>
                    {unreadCount > 0 && (
                      <span className="text-[10px] bg-rose-100 text-rose-700 px-1.5 py-0.5 rounded-full font-bold">
                        {unreadCount} baru
                      </span>
                    )}
                  </div>
                  {unreadCount > 0 && (
                    <button
                      onClick={onMarkAllNotificationsRead}
                      className="text-[11px] text-emerald-700 hover:underline font-semibold"
                    >
                      Tandai dibaca
                    </button>
                  )}
                </div>

                <div className="max-h-72 overflow-y-auto divide-y divide-neutral-100">
                  {notifications.map((notif) => (
                    <div
                      key={notif.id}
                      onClick={() => onMarkNotificationAsRead(notif.id)}
                      className={`p-3 text-left hover:bg-neutral-50 transition-colors cursor-pointer flex gap-2.5 ${
                        notif.unread ? 'bg-blue-50/30' : ''
                      }`}
                    >
                      <div className="mt-0.5 shrink-0">
                        {notif.category === 'Attendance' && <CheckCircle className="w-4 h-4 text-emerald-600" />}
                        {notif.category === 'Approval' && <Info className="w-4 h-4 text-amber-600" />}
                        {notif.category === 'Security' && <AlertTriangle className="w-4 h-4 text-rose-600" />}
                        {notif.category === 'System' && <Sparkles className="w-4 h-4 text-blue-600" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className="text-xs font-semibold text-neutral-900 truncate">{notif.title}</p>
                          <span className="text-[10px] text-neutral-400 shrink-0 ml-1">{notif.timestamp}</span>
                        </div>
                        <p className="text-[11px] text-neutral-500 mt-0.5 line-clamp-2 leading-relaxed">
                          {notif.message}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Profile / Role Selector Dropdown */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="flex items-center gap-2 p-1 sm:px-2.5 sm:py-1.5 rounded-xl border border-neutral-200 bg-white hover:bg-neutral-50 transition-all shadow-2xs"
          >
            <div className="w-6 h-6 rounded-full overflow-hidden bg-neutral-200 shrink-0">
              <img
                src={currentUser?.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80"}
                alt="User"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="hidden sm:block text-left">
              <span className="text-xs font-bold text-neutral-900 block leading-tight">
                {userRole}
              </span>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-neutral-400 hidden sm:block" />
          </button>

          {showProfileMenu && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setShowProfileMenu(false)} />
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl border border-neutral-200 shadow-xl z-50 p-2 animate-in fade-in-50 zoom-in-95 duration-100">
                <div className="px-3 py-2 border-b border-neutral-100 mb-1">
                  <p className="text-xs font-bold text-neutral-900">{currentUser?.name || 'Budi Santoso'}</p>
                  <p className="text-[10px] text-neutral-500">Active Role: {userRole}</p>
                </div>

                <div className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-neutral-400">
                  Ganti Hak Akses (Demo)
                </div>
                {(['Employee', 'Supervisor', 'Manager', 'HR', 'Admin', 'Superadmin'] as UserRole[]).map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => {
                      onChangeRole(r);
                      setShowProfileMenu(false);
                    }}
                    className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium flex items-center justify-between transition-colors ${
                      userRole === r
                        ? 'bg-neutral-900 text-white font-semibold'
                        : 'text-neutral-700 hover:bg-neutral-100'
                    }`}
                  >
                    <span>{r}</span>
                    {userRole === r && <span className="text-[10px]">Aktif</span>}
                  </button>
                ))}

                <div className="my-1 border-t border-neutral-100" />
                {onGoToLanding && (
                  <button
                    type="button"
                    onClick={() => {
                      setShowProfileMenu(false);
                      onGoToLanding();
                    }}
                    className="w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium text-neutral-700 hover:bg-neutral-100 flex items-center gap-2"
                  >
                    <Globe className="w-3.5 h-3.5 text-neutral-500" />
                    <span>Lihat Landing Page</span>
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => {
                    setShowProfileMenu(false);
                    onNavigate('profil');
                  }}
                  className="w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium text-neutral-700 hover:bg-neutral-100 flex items-center gap-2"
                >
                  <UserIcon className="w-3.5 h-3.5" />
                  <span>Pengaturan Profil</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setShowProfileMenu(false);
                    onLogout();
                  }}
                  className="w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium text-rose-600 hover:bg-rose-50 flex items-center gap-2"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Keluar (Logout)</span>
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
};
