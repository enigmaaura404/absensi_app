import React from 'react';
import { AttendanceStatus, RequestStatus } from '../../types';

interface StatusBadgeProps {
  status: AttendanceStatus | RequestStatus | 'Active' | 'Bound' | 'Suspicious' | 'Disabled' | 'On Leave' | 'Inactive' | 'Ready' | 'Review Needed' | 'Processed' | 'Nasional' | 'Perusahaan' | 'Cuti Bersama' | 'Investigating' | 'Resolved' | 'Action Required' | string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, className = '', size = 'md' }) => {
  let colorClasses = 'bg-neutral-100 text-neutral-700 border-neutral-200';
  let dotColor = 'bg-neutral-400';

  switch (status) {
    case 'Hadir':
    case 'Approved':
    case 'Active':
    case 'Ready':
    case 'Resolved':
      colorClasses = 'bg-emerald-50 text-emerald-700 border-emerald-200/80';
      dotColor = 'bg-emerald-500';
      break;

    case 'Terlambat':
    case 'Pending':
    case 'Review Needed':
    case 'Warning':
    case 'Investigating':
      colorClasses = 'bg-amber-50 text-amber-700 border-amber-200/80';
      dotColor = 'bg-amber-500';
      break;

    case 'Rejected':
    case 'Critical':
    case 'Suspicious':
    case 'Disabled':
    case 'Failed':
    case 'Action Required':
      colorClasses = 'bg-rose-50 text-rose-700 border-rose-200/80';
      dotColor = 'bg-rose-500';
      break;

    case 'Dinas':
    case 'Bound':
    case 'Processed':
    case 'Nasional':
      colorClasses = 'bg-blue-50 text-blue-700 border-blue-200/80';
      dotColor = 'bg-blue-500';
      break;

    case 'Cuti':
    case 'Perusahaan':
    case 'On Leave':
      colorClasses = 'bg-purple-50 text-purple-700 border-purple-200/80';
      dotColor = 'bg-purple-500';
      break;

    case 'Sakit':
      colorClasses = 'bg-orange-50 text-orange-700 border-orange-200/80';
      dotColor = 'bg-orange-500';
      break;

    case 'Izin':
    case 'Cuti Bersama':
      colorClasses = 'bg-sky-50 text-sky-700 border-sky-200/80';
      dotColor = 'bg-sky-500';
      break;

    case 'Belum Check-In':
    case 'Cancelled':
    case 'Inactive':
    default:
      colorClasses = 'bg-neutral-100 text-neutral-600 border-neutral-200';
      dotColor = 'bg-neutral-400';
      break;
  }

  const sizeClasses = {
    sm: 'text-[11px] px-2 py-0.5 font-medium gap-1.5',
    md: 'text-xs px-2.5 py-1 font-medium gap-1.5',
    lg: 'text-sm px-3 py-1.5 font-medium gap-2',
  }[size];

  return (
    <span
      className={`inline-flex items-center rounded-full border transition-colors ${sizeClasses} ${colorClasses} ${className}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${dotColor}`} />
      <span>{status}</span>
    </span>
  );
};
