import React, { useState } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  MapPin,
  Command,
} from 'lucide-react';
import { User, UserRole } from '../../types';
import { DynamicSidebarNav } from './DynamicSidebarNav';

interface SidebarProps {
  currentRoute: string;
  onNavigate: (route: string) => void;
  userRole: UserRole;
  pendingApprovalsCount: number;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
  onOpenCommandMenu?: () => void;
  currentUser?: User;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentRoute,
  onNavigate,
  userRole,
  pendingApprovalsCount,
  isOpenMobile,
  onCloseMobile,
  onOpenCommandMenu,
  currentUser,
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const handleNav = (route: string) => {
    onNavigate(route);
    onCloseMobile();
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpenMobile && (
        <div
          className="fixed inset-0 bg-black/40 z-40 lg:hidden backdrop-blur-xs animate-in fade-in duration-150"
          onClick={onCloseMobile}
        />
      )}

      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 bg-white border-r border-neutral-200/90 flex flex-col transition-all duration-200 ease-in-out lg:translate-x-0 ${
          isOpenMobile ? 'translate-x-0' : '-translate-x-full'
        } ${isCollapsed ? 'lg:w-20' : 'lg:w-64'} w-64`}
      >
        {/* Brand Header */}
        <div className="h-16 px-4 border-b border-neutral-100 flex items-center justify-between">
          <div
            className="flex items-center gap-2.5 cursor-pointer overflow-hidden"
            onClick={() => handleNav('dashboard')}
          >
            <div className="w-8 h-8 rounded-xl bg-neutral-900 flex items-center justify-center text-white shadow-xs shrink-0">
              <div className="relative">
                <MapPin className="w-4 h-4 text-emerald-400" />
                <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 rounded-full bg-emerald-400" />
              </div>
            </div>

            {!isCollapsed && (
              <div className="min-w-0 transition-opacity duration-150">
                <span className="text-sm font-bold tracking-tight text-neutral-900 block truncate">
                  ATTENDANCE
                </span>
                <span className="block text-[10px] font-medium text-neutral-400 tracking-wide -mt-0.5">
                  {userRole} Portal
                </span>
              </div>
            )}
          </div>

          {/* Desktop Collapse Toggle */}
          <button
            type="button"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="hidden lg:flex w-7 h-7 rounded-lg border border-neutral-200 items-center justify-center text-neutral-400 hover:text-neutral-900 hover:bg-neutral-50 transition-colors"
            title={isCollapsed ? 'Perluas Sidebar' : 'Ciutkan Sidebar'}
          >
            {isCollapsed ? <ChevronRight className="w-3.5 h-3.5" /> : <ChevronLeft className="w-3.5 h-3.5" />}
          </button>
        </div>

        {/* Global Quick Search Shortcut (⌘K / Ctrl+K) */}
        {!isCollapsed && onOpenCommandMenu && (
          <div className="px-3 pt-3">
            <button
              type="button"
              onClick={onOpenCommandMenu}
              className="w-full px-3 py-2 rounded-xl bg-neutral-50 hover:bg-neutral-100 border border-neutral-200/80 text-neutral-500 hover:text-neutral-800 text-xs font-medium flex items-center justify-between transition-colors shadow-2xs"
            >
              <div className="flex items-center gap-2">
                <Command className="w-3.5 h-3.5 text-neutral-400" />
                <span>Cari menu...</span>
              </div>
              <kbd className="text-[10px] font-mono bg-white px-1.5 py-0.2 rounded border border-neutral-200 text-neutral-400">
                ⌘K
              </kbd>
            </button>
          </div>
        )}

        {/* Dynamic Navigation Renderer (Reads from centralized config & filters by permissions) */}
        <DynamicSidebarNav
          userRole={userRole}
          currentRoute={currentRoute}
          isCollapsed={isCollapsed}
          pendingApprovalsCount={pendingApprovalsCount}
          onNavigate={handleNav}
        />

        {/* Bottom Role Info Card */}
        <div className="p-3 border-t border-neutral-100 bg-neutral-50/50">
          <div className="flex items-center gap-2.5 overflow-hidden">
            <div className="w-8 h-8 rounded-full bg-neutral-200 overflow-hidden shrink-0">
              <img
                src={currentUser?.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80"}
                alt="User"
                className="w-full h-full object-cover"
              />
            </div>
            {!isCollapsed && (
              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold text-neutral-900 truncate">
                  {currentUser?.name || 'Budi Santoso'}
                </p>
                <div className="flex items-center gap-1.5 mt-0.2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                  <span className="text-[10px] text-neutral-500 truncate font-semibold uppercase">
                    {userRole}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </aside>
    </>
  );
};
