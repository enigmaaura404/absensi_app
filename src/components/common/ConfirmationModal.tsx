import React from 'react';
import { AlertTriangle, CheckCircle2, Info, XCircle } from 'lucide-react';
import { Modal } from './Modal';

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'warning' | 'success' | 'info';
  isLoading?: boolean;
  children?: React.ReactNode;
}

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmText = 'Konfirmasi',
  cancelText = 'Batal',
  variant = 'info',
  isLoading = false,
  children,
}) => {
  const iconConfig = {
    info: { icon: Info, color: 'text-blue-600 bg-blue-50 border-blue-100' },
    success: { icon: CheckCircle2, color: 'text-emerald-600 bg-emerald-50 border-emerald-100' },
    warning: { icon: AlertTriangle, color: 'text-amber-600 bg-amber-50 border-amber-100' },
    danger: { icon: XCircle, color: 'text-rose-600 bg-rose-50 border-rose-100' },
  }[variant];

  const buttonStyle = {
    info: 'bg-neutral-900 hover:bg-neutral-800 text-white',
    success: 'bg-emerald-600 hover:bg-emerald-700 text-white',
    warning: 'bg-amber-600 hover:bg-amber-700 text-white',
    danger: 'bg-rose-600 hover:bg-rose-700 text-white',
  }[variant];

  const Icon = iconConfig.icon;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="" maxWidth="sm">
      <div className="flex flex-col items-center text-center">
        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border mb-3.5 ${iconConfig.color}`}>
          <Icon className="w-6 h-6" />
        </div>
        <h4 className="text-lg font-bold text-neutral-900 tracking-tight">{title}</h4>
        <p className="mt-1.5 text-xs text-neutral-500 leading-relaxed max-w-xs">{description}</p>
      </div>

      {children && <div className="mt-4">{children}</div>}

      <div className="mt-6 flex items-center gap-2.5">
        <button
          type="button"
          disabled={isLoading}
          onClick={onClose}
          className="flex-1 px-4 py-2.5 rounded-xl border border-neutral-200 text-xs font-semibold text-neutral-700 hover:bg-neutral-50 active:bg-neutral-100 transition-colors disabled:opacity-50"
        >
          {cancelText}
        </button>
        <button
          type="button"
          disabled={isLoading}
          onClick={onConfirm}
          className={`flex-1 px-4 py-2.5 rounded-xl text-xs font-semibold shadow-xs transition-colors disabled:opacity-50 flex items-center justify-center gap-1.5 ${buttonStyle}`}
        >
          {isLoading ? (
            <>
              <span className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
              <span>Memproses...</span>
            </>
          ) : (
            confirmText
          )}
        </button>
      </div>
    </Modal>
  );
};
