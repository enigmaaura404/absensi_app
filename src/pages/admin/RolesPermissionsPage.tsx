import React, { useState } from 'react';
import {
  KeyRound,
  Shield,
  CheckCircle2,
  Lock,
  Save,
  Users,
  Check,
} from 'lucide-react';
import { UserRole } from '../../types';

interface PermissionModule {
  name: string;
  key: string;
  permissions: {
    key: string;
    label: string;
    description: string;
  }[];
}

const MODULES: PermissionModule[] = [
  {
    name: 'Attendance (Presensi)',
    key: 'attendance',
    permissions: [
      { key: 'att_view', label: 'View', description: 'Melihat data presensi harian seluruh karyawan' },
      { key: 'att_create', label: 'Create', description: 'Melakukan input absensi manual' },
      { key: 'att_update', label: 'Update', description: 'Koreksi jam hadir dan timestamp absensi' },
      { key: 'att_delete', label: 'Delete', description: 'Menghapus log presensi dari sistem' },
    ],
  },
  {
    name: 'Employees (Karyawan)',
    key: 'employees',
    permissions: [
      { key: 'emp_view', label: 'View', description: 'Melihat direktori dan profil karyawan' },
      { key: 'emp_create', label: 'Create', description: 'Mendaftarkan karyawan baru' },
      { key: 'emp_update', label: 'Update', description: 'Mengedit data kontrak dan profil' },
      { key: 'emp_delete', label: 'Delete', description: 'Menonaktifkan akun karyawan' },
    ],
  },
  {
    name: 'Approvals (Pusat Persetujuan)',
    key: 'approvals',
    permissions: [
      { key: 'app_view', label: 'View', description: 'Melihat antrean pengajuan cuti, sakit, dinas' },
      { key: 'app_approve', label: 'Approve', description: 'Memberikan persetujuan permohonan' },
      { key: 'app_reject', label: 'Reject', description: 'Menolak permohonan karyawan' },
    ],
  },
  {
    name: 'Reports (Laporan & Analytics)',
    key: 'reports',
    permissions: [
      { key: 'rep_view', label: 'View', description: 'Melihat dashboard rekapitulasi kehadiran' },
      { key: 'rep_export', label: 'Export', description: 'Download rekap dalam format CSV / Excel' },
    ],
  },
  {
    name: 'System & Security',
    key: 'system',
    permissions: [
      { key: 'sys_manage', label: 'Manage Settings', description: 'Mengubah konfigurasi geofence dan 2FA' },
      { key: 'sys_audit', label: 'View Audit Trail', description: 'Mengakses log forensik audit sistem' },
    ],
  },
];

export const RolesPermissionsPage: React.FC = () => {
  const [selectedRole, setSelectedRole] = useState<UserRole>('HR');
  const [permissionsState, setPermissionsState] = useState<Record<string, Record<string, boolean>>>({
    Superadmin: {
      att_view: true, att_create: true, att_update: true, att_delete: true,
      emp_view: true, emp_create: true, emp_update: true, emp_delete: true,
      app_view: true, app_approve: true, app_reject: true,
      rep_view: true, rep_export: true,
      sys_manage: true, sys_audit: true,
    },
    Admin: {
      att_view: true, att_create: true, att_update: true, att_delete: false,
      emp_view: true, emp_create: true, emp_update: true, emp_delete: false,
      app_view: true, app_approve: true, app_reject: true,
      rep_view: true, rep_export: true,
      sys_manage: true, sys_audit: true,
    },
    HR: {
      att_view: true, att_create: true, att_update: true, att_delete: false,
      emp_view: true, emp_create: true, emp_update: true, emp_delete: false,
      app_view: true, app_approve: true, app_reject: true,
      rep_view: true, rep_export: true,
      sys_manage: false, sys_audit: true,
    },
    Manager: {
      att_view: true, att_create: false, att_update: false, att_delete: false,
      emp_view: true, emp_create: false, emp_update: false, emp_delete: false,
      app_view: true, app_approve: true, app_reject: true,
      rep_view: true, rep_export: true,
      sys_manage: false, sys_audit: false,
    },
    Supervisor: {
      att_view: true, att_create: false, att_update: false, att_delete: false,
      emp_view: true, emp_create: false, emp_update: false, emp_delete: false,
      app_view: true, app_approve: true, app_reject: true,
      rep_view: true, rep_export: false,
      sys_manage: false, sys_audit: false,
    },
    Employee: {
      att_view: false, att_create: false, att_update: false, att_delete: false,
      emp_view: false, emp_create: false, emp_update: false, emp_delete: false,
      app_view: false, app_approve: false, app_reject: false,
      rep_view: false, rep_export: false,
      sys_manage: false, sys_audit: false,
    },
  });

  const [isSaved, setIsSaved] = useState(false);

  const togglePermission = (permKey: string) => {
    setPermissionsState((prev) => ({
      ...prev,
      [selectedRole]: {
        ...prev[selectedRole],
        [permKey]: !prev[selectedRole]?.[permKey],
      },
    }));
  };

  const handleSave = () => {
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2500);
  };

  const rolesList: UserRole[] = ['Superadmin', 'Admin', 'HR', 'Manager', 'Supervisor', 'Employee'];

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-neutral-900">
            Role & Permission Management (RBAC)
          </h2>
          <p className="text-xs sm:text-sm text-neutral-500 mt-0.5">
            Konfigurasi hak akses berbasis matriks untuk membatasi kontrol data presensi dan sistem.
          </p>
        </div>

        <button
          type="button"
          onClick={handleSave}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white font-semibold text-xs shadow-xs transition-all active:scale-95"
        >
          <Save className="w-4 h-4" />
          <span>Simpan Perubahan Matriks</span>
        </button>
      </div>

      {isSaved && (
        <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Perubahan izin untuk Role {selectedRole} berhasil disimpan dan berlaku instan.</span>
        </div>
      )}

      {/* Role Selector Strip */}
      <div className="bg-white rounded-2xl border border-neutral-200 p-2 sm:p-3 shadow-2xs flex items-center gap-2 overflow-x-auto scrollbar-none">
        <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider px-2 shrink-0">
          Pilih Role:
        </span>
        {rolesList.map((r) => (
          <button
            key={r}
            type="button"
            onClick={() => setSelectedRole(r)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              selectedRole === r
                ? 'bg-neutral-900 text-white shadow-xs'
                : 'text-neutral-600 hover:bg-neutral-100'
            }`}
          >
            {r}
          </button>
        ))}
      </div>

      {/* Active Role Matrix Card */}
      <div className="bg-white rounded-3xl border border-neutral-200 p-6 sm:p-8 shadow-2xs space-y-6">
        <div className="flex items-center justify-between border-b border-neutral-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-neutral-100 flex items-center justify-center text-neutral-700">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-neutral-900">
                Hak Akses untuk Role: <span className="text-emerald-700 font-extrabold">{selectedRole}</span>
              </h3>
              <p className="text-xs text-neutral-500 mt-0.5">
                Centang izin yang diberikan kepada pengguna dengan role ini.
              </p>
            </div>
          </div>
        </div>

        {/* Modules Grid */}
        <div className="space-y-6">
          {MODULES.map((mod) => (
            <div key={mod.key} className="p-4 rounded-2xl bg-neutral-50/70 border border-neutral-100 space-y-3">
              <h4 className="text-xs font-bold text-neutral-900 uppercase tracking-wider">
                {mod.name}
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                {mod.permissions.map((p) => {
                  const isChecked = !!permissionsState[selectedRole]?.[p.key];
                  return (
                    <label
                      key={p.key}
                      className={`p-3 rounded-xl border transition-all cursor-pointer flex items-start gap-2.5 ${
                        isChecked
                          ? 'bg-white border-neutral-900 shadow-2xs'
                          : 'bg-white/50 border-neutral-200 text-neutral-400 hover:border-neutral-300'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => togglePermission(p.key)}
                        className="w-4 h-4 rounded border-neutral-300 text-neutral-900 focus:ring-neutral-900 mt-0.5"
                      />
                      <div>
                        <span className="block text-xs font-bold text-neutral-900">
                          {p.label}
                        </span>
                        <span className="block text-[10px] text-neutral-500 mt-0.5 leading-snug">
                          {p.description}
                        </span>
                      </div>
                    </label>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
