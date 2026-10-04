import React from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  title: string;
  message?: string;
}

interface ToastContainerProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export const ToastContainer: React.FC<ToastContainerProps> = ({ toasts, onDismiss }) => {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-20 sm:bottom-6 right-4 sm:right-6 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => {
        const icons = {
          success: <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />,
          error: <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />,
          info: <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />,
          warning: <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />,
        };

        const bgColors = {
          success: 'bg-emerald-50/95 border-emerald-200 text-emerald-900',
          error: 'bg-rose-50/95 border-rose-200 text-rose-900',
          info: 'bg-blue-50/95 border-blue-200 text-blue-900',
          warning: 'bg-amber-50/95 border-amber-200 text-amber-900',
        };

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start gap-3 p-3.5 rounded-xl border shadow-lg backdrop-blur-md transition-all animate-in slide-in-from-bottom-3 duration-200 ${bgColors[toast.type]}`}
          >
            {icons[toast.type]}
            <div className="flex-1">
              <h5 className="text-xs font-semibold">{toast.title}</h5>
              {toast.message && <p className="text-[11px] opacity-90 mt-0.5 leading-snug">{toast.message}</p>}
            </div>
            <button
              onClick={() => onDismiss(toast.id)}
              className="text-neutral-400 hover:text-neutral-700 transition-colors p-0.5"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
