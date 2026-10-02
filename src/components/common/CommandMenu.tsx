import React, { useState, useEffect } from 'react';
import {
  Search,
  ArrowRight,
  X,
  Command,
  MapPin,
  FileText,
  History,
  User,
  Users,
  CheckSquare,
  BarChart3,
  Calendar,
  Sliders,
  ShieldCheck,
  Smartphone,
  KeyRound,
  FileSpreadsheet,
} from 'lucide-react';
import { CENTRAL_NAVIGATION, hasPermission } from '../../config/navigation';
import { UserRole } from '../../types';

interface CommandMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (route: string) => void;
  userRole: UserRole;
}

export const CommandMenu: React.FC<CommandMenuProps> = ({
  isOpen,
  onClose,
  onNavigate,
  userRole,
}) => {
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) {
          onClose();
        }
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const accessibleItems = CENTRAL_NAVIGATION.filter((item) =>
    hasPermission(userRole, item.requiredPermissions)
  );

  const filteredItems = accessibleItems.filter(
    (item) =>
      item.label.toLowerCase().includes(query.toLowerCase()) ||
      (item.description && item.description.toLowerCase().includes(query.toLowerCase())) ||
      (item.section && item.section.toLowerCase().includes(query.toLowerCase()))
  );

  const handleSelect = (id: string) => {
    onNavigate(id);
    onClose();
    setQuery('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="fixed inset-0" onClick={onClose} />
      <div className="relative w-full max-w-xl bg-white rounded-2xl border border-neutral-200 shadow-2xl overflow-hidden z-10 animate-in zoom-in-95 duration-100">
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3.5 border-b border-neutral-100 gap-3">
          <Search className="w-4 h-4 text-neutral-400 shrink-0" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Ketik nama menu, aksi, atau fitur untuk navigasi instan..."
            className="w-full text-xs sm:text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none"
          />
          <kbd className="hidden sm:inline-flex items-center gap-0.5 px-2 py-0.5 text-[10px] font-mono text-neutral-400 bg-neutral-100 rounded border border-neutral-200">
            ESC
          </kbd>
          <button
            onClick={onClose}
            className="text-neutral-400 hover:text-neutral-700 p-1 sm:hidden"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results List */}
        <div className="max-h-80 overflow-y-auto p-2 divide-y divide-neutral-50">
          {filteredItems.length === 0 ? (
            <div className="py-8 text-center text-xs text-neutral-400">
              Tidak ada menu yang cocok dengan pencarian Anda.
            </div>
          ) : (
            filteredItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => handleSelect(item.id)}
                  className="w-full px-3 py-2.5 rounded-xl hover:bg-neutral-50 flex items-center justify-between text-left group transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-neutral-100 text-neutral-600 flex items-center justify-center group-hover:bg-neutral-900 group-hover:text-white transition-colors">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-neutral-900">{item.label}</p>
                      {item.description && (
                        <p className="text-[11px] text-neutral-500 mt-0.2">{item.description}</p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {item.section && (
                      <span className="text-[10px] font-bold text-neutral-400 bg-neutral-100 px-1.5 py-0.5 rounded">
                        {item.section}
                      </span>
                    )}
                    <ArrowRight className="w-3.5 h-3.5 text-neutral-300 group-hover:text-neutral-900 group-hover:translate-x-0.5 transition-all" />
                  </div>
                </button>
              );
            })
          )}
        </div>

        {/* Footer shortcuts */}
        <div className="px-4 py-2.5 bg-neutral-50 border-t border-neutral-100 flex items-center justify-between text-[11px] text-neutral-400">
          <span>Akses Role: <strong>{userRole}</strong></span>
          <span className="flex items-center gap-1.5 font-mono">
            <Command className="w-3 h-3" />+ K untuk menutup
          </span>
        </div>
      </div>
    </div>
  );
};
