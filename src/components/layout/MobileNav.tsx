import React from 'react';
import {
  LayoutDashboard,
  MapPin,
  FileText,
  History,
  User,
  CheckSquare,
  Users,
  Menu,
} from 'lucide-react';
import { UserRole } from '../../types';

interface MobileNavProps {
  currentRoute: string;
  onNavigate: (route: string) => void;
  onOpenSidebar: () => void;
  userRole: UserRole;
  pendingApprovalsCount: number;
}

interface MobileTabItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  prominent?: boolean;
  badge?: number;
}

export const MobileNav: React.FC<MobileNavProps> = ({
  currentRoute,
  onNavigate,
  onOpenSidebar,
  userRole,
  pendingApprovalsCount,
}) => {
  // Determine tabs dynamically based on user role
  let tabs: MobileTabItem[] = [
    { id: 'dashboard', label: 'Home', icon: LayoutDashboard },
    { id: 'kehadiran', label: 'Kehadiran', icon: MapPin, prominent: true },
    { id: 'pengajuan', label: 'Pengajuan', icon: FileText },
    { id: 'riwayat', label: 'Riwayat', icon: History },
    { id: 'profil', label: 'Profil', icon: User },
  ];

  if (userRole === 'Supervisor' || userRole === 'Manager') {
    tabs = [
      { id: 'dashboard', label: 'Home', icon: LayoutDashboard },
      { id: 'kehadiran', label: 'Kehadiran', icon: MapPin },
      {
        id: 'persetujuan',
        label: 'Approval',
        icon: CheckSquare,
        prominent: true,
        badge: pendingApprovalsCount,
      },
      { id: 'tim-saya', label: 'Tim', icon: Users },
      { id: 'profil', label: 'Profil', icon: User },
    ];
  } else if (userRole === 'HR' || userRole === 'Admin' || userRole === 'Superadmin') {
    tabs = [
      { id: 'dashboard', label: 'Home', icon: LayoutDashboard },
      { id: 'kehadiran', label: 'Kehadiran', icon: MapPin },
      {
        id: 'persetujuan',
        label: 'Approval',
        icon: CheckSquare,
        prominent: true,
        badge: pendingApprovalsCount,
      },
      { id: 'karyawan', label: 'Karyawan', icon: Users },
    ];
  }

  const showMoreDrawer =
    userRole === 'HR' || userRole === 'Admin' || userRole === 'Superadmin';

  return (
    <nav className="fixed bottom-0 inset-x-0 z-30 lg:hidden bg-white/95 backdrop-blur-md border-t border-neutral-200 px-2 py-1.5 flex items-center justify-around">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = currentRoute === tab.id;

        if (tab.prominent) {
          return (
            <button
              key={tab.id}
              onClick={() => onNavigate(tab.id)}
              className="flex flex-col items-center -mt-5 relative group"
            >
              <div className="w-12 h-12 rounded-full bg-neutral-900 text-emerald-400 flex items-center justify-center shadow-lg border-2 border-white transition-transform active:scale-95 relative">
                <Icon className="w-5 h-5" />
                {tab.badge && tab.badge > 0 ? (
                  <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-amber-500 text-white text-[9px] font-bold flex items-center justify-center">
                    {tab.badge}
                  </span>
                ) : null}
              </div>
              <span className="text-[10px] font-bold text-neutral-900 mt-1">
                {tab.label}
              </span>
            </button>
          );
        }

        return (
          <button
            key={tab.id}
            onClick={() => onNavigate(tab.id)}
            className={`flex flex-col items-center py-1 px-2.5 rounded-lg transition-colors relative ${
              isActive ? 'text-neutral-900 font-bold' : 'text-neutral-500'
            }`}
          >
            <Icon className="w-5 h-5" />
            <span className="text-[10px] mt-0.5">{tab.label}</span>
          </button>
        );
      })}

      {/* More / Menu Drawer for Enterprise Roles */}
      {showMoreDrawer && (
        <button
          onClick={onOpenSidebar}
          className="flex flex-col items-center py-1 px-2.5 rounded-lg text-neutral-500 hover:text-neutral-900 transition-colors"
        >
          <Menu className="w-5 h-5" />
          <span className="text-[10px] mt-0.5">Lainnya</span>
        </button>
      )}
    </nav>
  );
};
