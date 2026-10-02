import React from 'react';
import { UserRole } from '../../types';
import { getFilteredNav, Permission } from '../../config/navigation';

export interface DynamicSidebarNavProps {
  userRole: UserRole;
  currentRoute: string;
  isCollapsed: boolean;
  pendingApprovalsCount: number;
  userPermissions?: Permission[];
  onNavigate: (route: string) => void;
}

/**
 * DynamicSidebarNav
 *
 * Dedicated renderer that reads from the centralized navigation configuration
 * and renders filtered menu items dynamically based on the current user's role
 * and permissions (RBAC).
 */
export const DynamicSidebarNav: React.FC<DynamicSidebarNavProps> = ({
  userRole,
  currentRoute,
  isCollapsed,
  pendingApprovalsCount,
  userPermissions,
  onNavigate,
}) => {
  // Dynamically obtain permitted navigation sections and items
  const navSections = getFilteredNav(
    userRole,
    { pendingApprovals: pendingApprovalsCount },
    userPermissions
  );

  if (navSections.length === 0) {
    return (
      <div className="p-4 text-center text-xs text-neutral-400">
        Tidak ada menu yang tersedia untuk hak akses ini.
      </div>
    );
  }

  return (
    <nav
      className="flex-1 overflow-y-auto px-3 py-3 space-y-5"
      role="navigation"
      aria-label="Sistem Navigasi Utama"
    >
      {navSections.map((sec, secIdx) => (
        <div key={sec.sectionId || sec.section || secIdx} className="space-y-1">
          {/* Section Header */}
          {!isCollapsed && sec.section && (
            <div className="px-2 pb-1.5 text-[10px] font-bold uppercase tracking-wider text-neutral-400 select-none">
              {sec.section}
            </div>
          )}

          {/* Section Item List */}
          <ul className="space-y-0.5" role="list">
            {sec.items.map((item) => {
              const Icon = item.icon;
              const isActive = currentRoute === item.id;

              return (
                <li key={item.id} role="listitem">
                  <button
                    type="button"
                    onClick={() => onNavigate(item.id)}
                    title={isCollapsed ? item.label : item.description}
                    aria-current={isActive ? 'page' : undefined}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all group relative cursor-pointer ${
                      isActive
                        ? 'bg-neutral-900 text-white font-semibold shadow-xs'
                        : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <Icon
                        className={`w-4 h-4 shrink-0 transition-transform ${
                          isActive
                            ? 'text-emerald-400'
                            : 'text-neutral-500 group-hover:scale-105'
                        }`}
                      />
                      {!isCollapsed && (
                        <span className="truncate">{item.label}</span>
                      )}
                    </div>

                    {/* Badge & Active State Indicators */}
                    {!isCollapsed ? (
                      item.badge && item.badge > 0 ? (
                        <span
                          className="w-5 h-5 rounded-full bg-amber-500 text-white text-[10px] font-bold flex items-center justify-center shrink-0 shadow-2xs"
                          title={`${item.badge} pending review`}
                        >
                          {item.badge}
                        </span>
                      ) : isActive ? (
                        <span className="text-[11px] text-emerald-400 font-mono">▸</span>
                      ) : null
                    ) : (
                      item.badge && item.badge > 0 && (
                        <span className="w-2.5 h-2.5 rounded-full bg-amber-500 absolute top-2 right-2 border-2 border-white ring-1 ring-amber-500/20" />
                      )
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </nav>
  );
};
